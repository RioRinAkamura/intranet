/**
 *
 * HeaderButton
 *
 */
import { Col, notification, Progress, Row, Table, Tooltip, Upload } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DialogModal } from 'app/components/DialogModal';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
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

type Employee = models.hr.Employee;

interface HeaderButtonProps {
  imported: boolean;
  setImported: (imported: boolean) => void;
  selectedRows?: Employee[];
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const { imported, setImported } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const [previewModal, setPreviewModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<Employee[]>([]);
  const [logImportId, setLogImportId] = useState('');
  const [loading, setLoading] = useState(false);
  const interval = useRef<number | null>(null);

  const exportAll = async () => {
    const response: any = await fakeAPI.get('/hr/employees/export/');
    if (response) {
      notification.open({
        message: 'Exporting',
        key: 'export',
        description: (
          <>
            <div>
              <b>{t(UsersMessages.exportCSVMessage())}</b>
            </div>
            <a
              href="#0"
              onClick={e => {
                e.preventDefault();
                window.open(
                  response.download_url,
                  '_blank',
                  'noopener,noreferrer',
                );
                notification.close('export');
              }}
            >
              {response.download_url}
            </a>
          </>
        ),
        duration: 0,
      });
    }
  };

  useEffect(() => {
    if (logImportId && !imported) {
      let intervalId = setInterval(async () => {
        await fakeAPI
          .get(`/hr/employees/import/${logImportId}/`)
          .then((response: any) => {
            const total = response.total_records;
            const success = response.success;
            const fails = response.fails;
            const successPercent = (response.success / total) * 100;
            const failsPercent = (response.fails / total) * 100;
            const percent = successPercent + failsPercent;

            notification.success({
              message: 'Imported',
              key: 'import',
              description: (
                <>
                  <div>
                    <b>
                      {percent === 100
                        ? 'Your data are imported'
                        : 'Your data are importing...'}
                    </b>
                    <Tooltip
                      title={success + ' Success and ' + fails + ' Failed'}
                    >
                      <Progress
                        percent={percent}
                        success={{ percent: successPercent }}
                        status={failsPercent === 100 ? 'exception' : 'normal'}
                        strokeColor="red"
                      />
                    </Tooltip>
                  </div>
                </>
              ) as React.ReactNode,
              duration: 0,
            });

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
            <>
              <div>
                <b>Your data are importing...</b>
              </div>
            </>
          ),
          duration: 0,
        });
      }
    }
  };

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
        <Button block onClick={exportAll}>
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
        title={t(UsersMessages.modalPreviewCSVTitle())}
        isOpen={previewModal}
        handleCancel={() => {
          setPreviewModal(false);
        }}
        handleSubmit={handleImport}
        loading={loading}
        cancelText={t(UsersMessages.modalFormCancelButton())}
        okText={t(UsersMessages.modalFormSubmitButton())}
        width={1500}
      >
        <Table
          columns={columns}
          rowKey="id"
          dataSource={data}
          pagination={false}
        />
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
