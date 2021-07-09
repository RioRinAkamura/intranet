/**
 *
 * HeaderButton
 *
 */
import {
  Col,
  notification,
  Popover,
  Progress,
  Row,
  Table,
  TablePaginationConfig,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DialogModal } from 'app/components/DialogModal';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import {
  ExportOutlined,
  ImportOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { ProjectsMessages } from '../../messages';
import moment from 'moment';
import { antColours } from 'utils/types';
import { ColumnsType } from 'antd/lib/table';
import fakeAPI from 'utils/fakeAPI';
import Papa from 'papaparse';
import Button from 'app/components/Button';

interface HeaderButtonProps {
  pagination?: TablePaginationConfig;
  data?: Employee[];
  selectedRows?: Employee[];
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [previewModal, setPreviewModal] = useState(false);
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<any[]>([]);
  const [logImportId, setLogImportId] = useState('');
  const [imported, setImported] = useState(false);
  const [loading, setLoading] = useState(false);

  const exportAll = async () => {
    const response: any = await fakeAPI.get('/hr/employees/export/');
    if (response) {
      notification.open({
        message: 'Exporting',
        key: 'export',
        description: (
          <>
            <div>
              <b>{t(ProjectsMessages.exportCSVMessage())}</b>
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

  const exportSelected = async () => {
    console.log('Export Selected');
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
              ),
              duration: 0,
            });

            if (response.status === 'Done') {
              setImported(true);
              clearInterval(intervalId);
            }
          });
      }, 1000);
    }
  }, [logImportId, imported]);

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

  const memberChildren = (dataIndex: string) => ({
    dataIndex: ['members'],
    width: 250,
    render: (text, record: any) => {
      let members;
      if (dataIndex === 'OTHER') {
        members = text.filter(
          item =>
            item.project_role !== 'PM' &&
            item.project_role !== 'LD' &&
            item.project_role !== 'QC' &&
            item.project_role !== 'DEV',
        );
      } else {
        members = text.filter(item => item.project_role === dataIndex);
      }
      return (
        <div>
          {members.map(member => {
            const info = member.employee;
            return (
              <div style={{ marginBottom: '5px' }}>
                <span>
                  <Avatar
                    src={info.avatar}
                    name={info.first_name + ' ' + info.last_name}
                    size={30}
                  />
                  {` ${info.first_name} ${info.last_name} `}
                  <Tag color={antColours[member.allocation]}>
                    {member.allocation}
                  </Tag>
                </span>
              </div>
            );
          })}
        </div>
      );
    },
  });

  const columns: ColumnsType<any> = [
    {
      title: t(ProjectsMessages.listNameTitle()),
      dataIndex: 'name',
      width: 110,
      fixed: 'left',
    },
    {
      title: t(ProjectsMessages.listTMTitle()),
      children: [
        {
          title: t(ProjectsMessages.listPMTitle()),
          ...memberChildren('PM'),
        },
        {
          title: t(ProjectsMessages.listLDTitle()),
          ...memberChildren('LD'),
        },
        {
          title: t(ProjectsMessages.listQCTitle()),
          ...memberChildren('QC'),
        },
        {
          title: t(ProjectsMessages.listDEVTitle()),
          ...memberChildren('DEV'),
        },
        {
          title: t(ProjectsMessages.listOTHERTitle()),
          ...memberChildren('OTHER'),
        },
      ],
    },
    {
      title: t(ProjectsMessages.listStartedTitle()),
      dataIndex: 'started',
      width: 120,
      render: text => moment(text).format('DD-MM-YYYY'),
    },
    {
      title: t(ProjectsMessages.listPriorityTitle()),
      dataIndex: 'priority',
      width: 140,
    },
    {
      title: t(ProjectsMessages.listStatusTitle()),
      dataIndex: 'status',
      width: 130,
    },
  ];

  const exportCSVType = (
    <WrapperExport gutter={[8, 8]}>
      <Col span={24}>
        <Button disabled block onClick={exportAll}>
          {t(ProjectsMessages.exportAllProject())}
        </Button>
      </Col>
      <Col span={24}>
        <Button disabled block onClick={exportSelected}>
          {t(ProjectsMessages.exportSelected())}
        </Button>
      </Col>
    </WrapperExport>
  );

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
          size="large"
          type="primary"
          onClick={() => history.push('/projects/create')}
          icon={<ProjectOutlined />}
        >
          {t(ProjectsMessages.createProjectButton())}
        </Button>
      </OptionButton>
      <OptionButton>
        <Popover placement="bottom" content={exportCSVType}>
          <Button size="large" icon={<ExportOutlined />}>
            {t(ProjectsMessages.exportCSV())}
          </Button>
        </Popover>
      </OptionButton>
      <OptionButton>
        <Upload
          disabled
          showUploadList={false}
          beforeUpload={beforeUpload}
          accept=".xlsx, .xls, .csv"
        >
          <Button loading={loading} block size="large">
            <ImportOutlined /> {t(ProjectsMessages.importCSV())}
          </Button>
        </Upload>
      </OptionButton>
      <DialogModal
        title={t(ProjectsMessages.modalPreviewCSVTitle())}
        isOpen={previewModal}
        handleCancel={() => {
          setPreviewModal(false);
        }}
        handleSubmit={handleImport}
        cancelText={t(ProjectsMessages.modalFormCancelButton())}
        okText={t(ProjectsMessages.modalFormSubmitButton())}
        width={1000}
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

const WrapperExport = styled(Row)`
  width: 300px;
`;
