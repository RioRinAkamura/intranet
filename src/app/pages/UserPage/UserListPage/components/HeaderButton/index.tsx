/**
 *
 * HeaderButton
 *
 */
import { Button, Col, Popover, Row, Table, TablePaginationConfig } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { DialogModal } from 'app/components/DialogModal';
import * as React from 'react';
import CSVReader from 'react-csv-reader';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { UsersMessages } from '../../messages';
import { CSVLink } from 'react-csv';
import { request } from 'utils/request';
import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import {
  ExportOutlined,
  ImportOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

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

  const columns = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      render: (text, record: Employee) => (
        <Avatar
          size={100}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
          name={record.first_name + ' ' + record.last_name}
        />
      ),
    },
    {
      title: t(UsersMessages.listFirstNameTitle()),
      dataIndex: 'first_name',
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
        multiple: 2,
      },
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      sorter: {
        compare: (a, b) => a.last_name.localeCompare(b.last_name),
        multiple: 1,
      },
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
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
            {t(UsersMessages.exportAllUser())}
          </CSVLink>
        </Button>
      </Col>
      <Col span={24}>
        <Button block>
          <CSVLink
            filename={'users-page-' + pagination?.current + '.csv'}
            data={data}
          >
            {t(UsersMessages.exportPerPage())}
          </CSVLink>
        </Button>
      </Col>
      <Col span={24}>
        <Button
          block
          disabled={selectedRows && selectedRows?.length > 0 ? false : true}
        >
          <CSVLink filename={'users-page-select.csv'} data={selectedRows || []}>
            {t(UsersMessages.exportSelected())}
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
          onClick={() => history.push('/create-user')}
          icon={<UserAddOutlined />}
        >
          {t(UsersMessages.createUserButton())}
        </Button>
      </OptionButton>
      <OptionButton>
        <Popover placement="bottom" content={exportCSVType}>
          <Button size="large" icon={<ExportOutlined />}>
            {t(UsersMessages.exportCSV())}
          </Button>
        </Popover>
      </OptionButton>
      <OptionButton>
        <ButtonImport size="large">
          <CSVReader
            cssClass="react-csv-input"
            label={
              <>
                <ImportOutlined /> {t(UsersMessages.importCSV())}
              </>
            }
            inputStyle={{ display: 'none' }}
            onFileLoaded={handleForce}
            parserOptions={papaparseOptions}
          />
        </ButtonImport>
      </OptionButton>
      <DialogModal
        title={t(UsersMessages.modalPreviewCSVTitle())}
        isOpen={previewModal.open}
        handleCancel={() => {
          setPreviewModal({ open: false, data: [] });
        }}
        handleSubmit={handleImport}
        cancelText={t(UsersMessages.modalFormCancelButton())}
        okText={t(UsersMessages.modalFormSubmitButton())}
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
