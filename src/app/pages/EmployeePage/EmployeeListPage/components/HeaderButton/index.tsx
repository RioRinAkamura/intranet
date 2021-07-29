/**
 *
 * HeaderButton
 *
 */
import { Col, notification, Row, Table, Upload } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DialogModal } from 'app/components/DialogModal';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components/macro';
import { UsersMessages } from '../../messages';
import {
  ExportOutlined,
  ImportOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import fakeAPI from 'utils/fakeAPI';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import Papa from 'papaparse';
import { TagComponent } from 'app/components/Tags/components/Tag';
import Button from 'app/components/Button';
import ImportState from '../ImportState';
import ExportState from '../ExportState';

type Employee = models.hr.Employee;

interface HeaderButtonProps {
  imported: boolean;
  setImported: (imported: boolean) => void;
  selectedRows?: Employee[];
}
export interface ObjErr {
  record: string;
}
export interface ImportResult {
  total_records: number;
  success: number;
  fails: number;
  status: string;
  download_url: string;
  errors: Array<ObjErr>;
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const { imported, setImported } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { search } = useLocation();

  const [previewModal, setPreviewModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<Employee[]>([]);
  const [logImportId, setLogImportId] = useState('');
  const [loading, setLoading] = useState(false);
  const interval = useRef<number | null>(null);
  const [exportId, setExportId] = useState('');
  const [exported, setExported] = useState(false);

  const exportEmployees = async () => {
    if (search) {
      var response: any = await fakeAPI.get(`/hr/employees/export${search}`);
    } else {
      response = await fakeAPI.get('/hr/employees/export/');
    }
    if (response) {
      setExportId(response.id);
      setExported(false);
      notification.info({
        message: 'Exporting',
        key: 'export',
        description: (
          <div>
            <b>{t(UsersMessages.exportCSVMessageRequest())}</b>
          </div>
        ),
        duration: 0,
      });
    }
  };

  const notificationExport = (response: ImportResult) => {
    const total = response.total_records;
    const success = response.success;
    const fails = response.fails;
    const successPercent = (response.success / total) * 100;
    const failsPercent = (response.fails / total) * 100;
    const percent = successPercent + failsPercent;
    let type: string = '';
    fails > 0 ? (type = 'error') : (type = 'success');
    notification[type]({
      message: 'Exported',
      key: 'export',
      description: (
        <ExportState
          success={success}
          fails={fails}
          percent={percent}
          failsPercent={failsPercent}
          successPercent={successPercent}
        />
      ) as React.ReactNode,
      duration: 0,
    });
  };

  useEffect(() => {
    if (exportId && !exported) {
      let intervalId = setInterval(async () => {
        await fakeAPI
          .get(`/hr/employees/export/${exportId}`)
          .then((response: any) => {
            notificationExport(response);
            if (response.status === 'Done') {
              window.open(response.download_url);
              setExported(true);
            }
          });
      }, 1000);
      interval.current = intervalId;
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [exportId, exported, setExported]);

  const handleImport = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append('upload_file', file);
      formData.append('upsert', '1');
      const response: any = await fakeAPI.post(
        '/hr/employees/import/',
        formData,
      );
      if (response) {
        setPreviewModal(false);
        setLoading(false);
        setImported(false);
        setLogImportId(response.id);
        notification.info({
          message: 'Importing',
          key: 'import',
          description: (
            <div>
              <b>{t(UsersMessages.importCSVMessageRequest())}</b>
            </div>
          ),
          duration: 0,
        });
      }
    }
  };

  const notificationImport = (response: ImportResult) => {
    const total = response.total_records;
    const success = response.success;
    const fails = response.fails;
    const successPercent = (response.success / total) * 100;
    const failsPercent = (response.fails / total) * 100;
    const percent = successPercent + failsPercent;
    const arrErr: Array<ObjErr> = [];
    for (let item of response.errors) {
      let arr: ObjErr = { record: `${Object.values(item)}` };
      arrErr.push(arr);
    }
    let type: string = '';
    fails > 0 ? (type = 'error') : (type = 'success');
    notification[type]({
      message: 'Imported',
      key: 'import',
      description: (
        <ImportState
          success={success}
          fails={fails}
          percent={percent}
          arrErr={arrErr}
          failsPercent={failsPercent}
          successPercent={successPercent}
        />
      ) as React.ReactNode,
      duration: 0,
    });
  };

  useEffect(() => {
    if (logImportId && !imported) {
      let intervalId = setInterval(async () => {
        await fakeAPI
          .get(`/hr/employees/import/${logImportId}`)
          .then((response: any) => {
            notificationImport(response);
            if (response.status === 'Done') {
              setImported(true);
            }
          });
      }, 1000);
      interval.current = intervalId;
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [logImportId, imported, setImported]);

  const columns = [
    {
      dataIndex: 'avatar',
      render: (text, record: Employee) => (
        <Avatar
          size={50}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
          name={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listNameTitle()),
      dataIndex: 'first_name',
      render: (text, record) => {
        return <div>{record.first_name + ' ' + record.last_name}</div>;
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (text, record: Employee, index: number) => {
        return (
          <>
            {text?.map(tag => {
              return <TagComponent tag={tag} key={tag} />;
            })}
          </>
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

  const beforeUpload = (file: File) => {
    setFile(file);
    Papa.parse(file, {
      delimiter: '',
      chunkSize: 3,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
      complete: (results: Papa.ParseResult<Employee>) => {
        setPreviewModal(true);
        setData(results.data);
      },
    });
    return false;
  };
  return (
    <Row justify="end">
      <OptionButton>
        <Button
          type="primary"
          onClick={() => history.push('/employees/create')}
          icon={<UserAddOutlined />}
        >
          {t(UsersMessages.createUserButton())}
        </Button>
      </OptionButton>
      <OptionButton>
        <Button block onClick={exportEmployees}>
          <ExportOutlined /> {t(UsersMessages.exportCSV())}
        </Button>
      </OptionButton>
      <OptionButton>
        <Upload
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept=".csv"
        >
          <Button loading={loading} block>
            <ImportOutlined /> {t(UsersMessages.importCSV())}
          </Button>
        </Upload>
      </OptionButton>
      <DialogModal
        // title={t(UsersMessages.modalPreviewCSVTitle())}
        title={t(UsersMessages.modalConfirmCSVTitle())}
        isOpen={previewModal}
        handleCancel={() => {
          setPreviewModal(false);
        }}
        handleSubmit={handleImport}
        loading={loading}
        cancelText={t(UsersMessages.modalFormCancelButton())}
        okText={t(UsersMessages.modalFormSubmitButton())}
        width={350}
      >
        <Row>{file?.name}</Row>
        {/* <Table
          columns={columns}
          rowKey="id"
          dataSource={data}
          pagination={false}
        /> */}
      </DialogModal>
    </Row>
  );
};

const OptionButton = styled(Col)`
  margin-left: 1em;
  margin-bottom: 1em;

  button {
    display: flex;
    align-items: center;
  }
`;
