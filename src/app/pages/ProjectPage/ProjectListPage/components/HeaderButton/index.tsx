/**
 *
 * HeaderButton
 *
 */
import {
  Button,
  Col,
  Popover,
  Row,
  Table,
  TablePaginationConfig,
  Tag,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DialogModal } from 'app/components/DialogModal';
import * as React from 'react';
import CSVReader from 'react-csv-reader';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { CSVLink } from 'react-csv';
import { request } from 'utils/request';
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

interface HeaderButtonProps {
  pagination?: TablePaginationConfig;
  data?: Employee[];
  selectedRows?: Employee[];
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const { pagination, data, selectedRows } = props;
  const { t } = useTranslation();
  const history = useHistory();

  const [previewModal, setPreviewModal] = React.useState({
    open: false,
    data: [],
  });
  const [users, setUsers] = React.useState([]);

  const handleForce = (data: any) => {
    setPreviewModal({ open: true, data: data });
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const getAllUsers = (event, done) => {
    request('https://reqres.in/api/users').then((response: any) => {
      setUsers(response.data);
      if (users) {
        done();
      }
    });
  };

  const handleImport = () => {
    console.log('Handle Import CSV');
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
        <Button block>
          <CSVLink
            filename={'users-page.csv'}
            data={users}
            asyncOnClick={true}
            onClick={getAllUsers}
          >
            {t(ProjectsMessages.exportAllProject())}
          </CSVLink>
        </Button>
      </Col>
      <Col span={24}>
        <Button block>
          <CSVLink
            filename={'users-page-' + pagination?.current + '.csv'}
            data={data}
          >
            {t(ProjectsMessages.exportPerPage())}
          </CSVLink>
        </Button>
      </Col>
      <Col span={24}>
        <Button
          block
          disabled={selectedRows && selectedRows?.length > 0 ? false : true}
        >
          <CSVLink filename={'users-page-select.csv'} data={selectedRows || []}>
            {t(ProjectsMessages.exportSelected())}
          </CSVLink>
        </Button>
      </Col>
    </WrapperExport>
  );

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
        <ButtonImport size="large">
          <CSVReader
            cssClass="react-csv-input"
            label={
              <>
                <ImportOutlined /> {t(ProjectsMessages.importCSV())}
              </>
            }
            inputStyle={{ display: 'none' }}
            onFileLoaded={handleForce}
            parserOptions={papaparseOptions}
          />
        </ButtonImport>
      </OptionButton>
      <DialogModal
        title={t(ProjectsMessages.modalPreviewCSVTitle())}
        isOpen={previewModal.open}
        handleCancel={() => {
          setPreviewModal({ open: false, data: [] });
        }}
        handleSubmit={handleImport}
        cancelText={t(ProjectsMessages.modalFormCancelButton())}
        okText={t(ProjectsMessages.modalFormSubmitButton())}
        width={1000}
      >
        <Table
          columns={columns}
          rowKey="id"
          dataSource={previewModal.data}
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

const ButtonImport = styled(Button)`
  label {
    display: flex;
    align-items: center;
    span {
      margin-right: 10px;
    }
  }
  label:hover {
    cursor: pointer;
  }
`;

const WrapperExport = styled(Row)`
  width: 300px;
`;
