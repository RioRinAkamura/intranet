import {
  Button,
  Col,
  Input,
  Row,
  Space,
  Table,
  Form,
  Modal,
  Upload,
  message,
  Tooltip,
  Avatar,
  List,
  Spin,
  Collapse,
  TablePaginationConfig,
  Divider,
  DatePicker,
  Radio,
  Select,
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
  PlusOutlined,
  SearchOutlined,
  SkypeFilled,
  SkypeOutlined,
  TwitterCircleFilled,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteModal } from 'app/components/DeleteModal';
import { useUserspageSlice } from './slice';
import { CSVLink } from 'react-csv';
import CSVReader from 'react-csv-reader';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { isEmpty, isEqual } from 'lodash';
import { DialogModal } from 'app/components/DialogModal';
import { useTranslation } from 'react-i18next';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/lib/table/interface';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { UsersMessages } from './messages';
import { Helmet } from 'react-helmet-async';

import { ToastMessageType } from 'app/components/ToastNotification';
import { useNotify } from 'app/components/ToastNotification';
import { UserDetailPage } from '../UserDetailPage/Loadable';
import { useHistory } from 'react-router';
const { Panel } = Collapse;

interface UserProfile {
  id: string;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
  totalPage?: number;
}

interface Filters {
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
}

export const Users: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [tablePagination, setTablePagination] = useState<Pagination>({
    current: 1,
    pageSize: 4,
    total: 0,
    totalPage: 0,
  });
  const [tableFilters, setTableFilters] = useState<Filters>({
    email: null,
    first_name: null,
    last_name: null,
  });
  const [tableSort, setTableSort] = useState({});
  const [loading, setLoading] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [isMore, setIsMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [previewModal, setPreviewModal] = useState({ open: false, data: [] });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const history = useHistory();

  const { notify } = useNotify();
  useEffect(() => {
    fetchData(tablePagination);
  }, []);

  const fetchData = (pagination: Pagination) => {
    setLoading(true);
    request(
      'https://reqres.in/api/users?page=' +
        pagination.current +
        '&per_page=' +
        pagination.pageSize,
    ).then((response: any) => {
      setData(response.data);
      tablePagination.total = response.total;
      tablePagination.current = response.page;
      tablePagination.totalPage = response.total_pages;
      setTablePagination(tablePagination);
      setLoading(false);
    });
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    const filterChanges = !isEqual(filters, tableFilters);
    const sortChanges = !isEqual(sorter, tableSort);
    if (filterChanges || sortChanges) {
      setTableFilters(filters);
      setTableSort(sorter);
    }
    if (!filterChanges && !sortChanges) {
      fetchData(
        filterChanges
          ? { ...tablePagination }
          : { ...pagination, totalPage: 0 },
      );
    }
  };

  const fetchLoadMoreData = useCallback(
    (pagination: Pagination) => {
      setLoading(true);
      request(
        'https://reqres.in/api/users?page=' +
          pagination.current +
          '&per_page=' +
          pagination.pageSize,
      ).then((response: any) => {
        if (response.data.length > 0) {
          let currentData = data;
          const list = currentData.concat(response.data);
          setData(list);
          tablePagination.total = response.total;
          tablePagination.current = response.page;
          tablePagination.totalPage = response.total_pages;
          setTablePagination({
            ...tablePagination,
          });
          if (tablePagination.current === tablePagination.totalPage) {
            setIsMore(false);
          }
          setLoading(false);
          setMoreLoading(false);
        }
      });
    },
    [data, tablePagination],
  );

  useEffect(() => {
    const handleLoadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.scrollingElement?.scrollHeight
      ) {
        const isNotMore = tablePagination.current === tablePagination.totalPage;
        if (!isNotMore) {
          setMoreLoading(true);
          if (!moreLoading) {
            fetchLoadMoreData({
              ...tablePagination,
              current: tablePagination.current && tablePagination.current + 1,
            });
          }
        }
      }
    };
    if (isMobileOnly) {
      document.addEventListener('scroll', handleLoadMore);
      return () => {
        document.removeEventListener('scroll', handleLoadMore);
      };
    }
  }, [fetchLoadMoreData, isMore, moreLoading, tablePagination]);

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${t(
            UsersMessages.filterInputPlaceholder(),
          )} ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterSearchButton())}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t(UsersMessages.filterResetButton())}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            {t(UsersMessages.filterFilterButton())}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    filtered: true,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (
    selectedKeys: React.SetStateAction<string>[],
    confirm: () => void,
    dataIndex: string,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const totalSearch = () => {
    const values = searchForm.getFieldsValue();
    dispatch(actions.searchUsers(values));
  };

  const resetTotalSearch = () => {
    searchForm.resetFields();
    fetchData({ ...tablePagination, current: 1 });
  };

  const columns = [
    {
      title: t(UsersMessages.listAvatarTitle()),
      dataIndex: 'avatar',
      render: (text, record: UserProfile) => (
        <Avatar
          size={100}
          src={text}
          alt={record.first_name + ' ' + record.last_name}
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
      ...getColumnSearchProps('first_name'),
    },
    {
      title: t(UsersMessages.listLastNameTitle()),
      dataIndex: 'last_name',
      sorter: {
        compare: (a, b) => a.last_name.localeCompare(b.last_name),
        multiple: 1,
      },
      ...getColumnSearchProps('last_name'),
    },
    {
      title: t(UsersMessages.listEmailTitle()),
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: t(UsersMessages.listOptionsTitle()),
      dataIndex: 'id',
      render: (text, record: UserProfile, index: number) => {
        return (
          <>
            <Tooltip title={t(UsersMessages.listViewTooltip())}>
              <IconButton
                type="primary"
                size="large"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => {
                  history.push(`users/${text}`);
                }}
              />
            </Tooltip>
            <Tooltip title={t(UsersMessages.listEditTooltip())}>
              <IconButton
                size="large"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  history.push({
                    pathname: '/users/' + text,
                    state: { edit: true },
                  });
                }}
              />
            </Tooltip>
            <Tooltip title={t(UsersMessages.listDeleteTooltip())}>
              <IconButton
                danger
                size="large"
                shape="circle"
                icon={<DeleteOutlined />}
                onClick={() => {
                  setDeleteModal({ open: true, id: text });
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleForce = (data: any) => {
    setPreviewModal({ open: true, data: data });
  };

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  const handleDelete = () => {
    const userId = deleteModal.id;
    if (userId) {
      dispatch(actions.deleteUser(userId));
    }
  };

  const handleImport = () => {
    const data = previewModal.data;
    if (data.length > 0) {
      dispatch(actions.importUsers(data));
    }
  };

  return (
    <>
      <Helmet>
        <title>{t(UsersMessages.title())}</title>
        <meta name="description" content={t(UsersMessages.description())} />
      </Helmet>
      <h1>{t(UsersMessages.title())}</h1>
      <Collapse style={{ margin: '1em 0 1em 0' }}>
        <Panel header={t(UsersMessages.searchTitle())} key="1">
          <Form
            form={searchForm}
            labelCol={{ xxl: 6, xl: 8, lg: 6, md: 8, xs: 6 }}
            wrapperCol={{ xxl: 18, xl: 16, lg: 18, md: 16, xs: 18 }}
          >
            <Row gutter={[8, 8]}>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem
                  name="first_name"
                  label={t(UsersMessages.searchFirstName())}
                >
                  <Input
                    placeholder={t(UsersMessages.searchFirstNamePlaceholder())}
                  />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem
                  name="last_name"
                  label={t(UsersMessages.searchLastName())}
                >
                  <Input
                    placeholder={t(UsersMessages.searchLastNamePlaceholder())}
                  />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem name="email" label={t(UsersMessages.searchEmail())}>
                  <Input
                    placeholder={t(UsersMessages.searchEmailPlaceholder())}
                  />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem
                  name="phone"
                  label={t(UsersMessages.searchPhoneNumber())}
                >
                  <Input
                    placeholder={t(
                      UsersMessages.searchPhoneNumberPlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={[8, 8]} justify="end">
              <Col>
                <Button type="primary" onClick={totalSearch}>
                  {t(UsersMessages.searchSearchButton())}
                </Button>
              </Col>
              <Col>
                <Button onClick={resetTotalSearch}>
                  {t(UsersMessages.searchResetButton())}
                </Button>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
      {isMobileOnly ? (
        <>
          <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="vertical"
            dataSource={data}
            renderItem={(user: UserProfile, index: number) => (
              <ListItem key={index}>
                <Row gutter={[8, 8]}>
                  <Col style={{ textAlign: 'center' }} span={10}>
                    <Avatar size={{ xs: 130 }} src={user.avatar} />
                  </Col>
                  <Col span={14}>
                    <h2>{user.first_name + ' ' + user.last_name}</h2>
                    <ProfileDescription gutter={[8, 8]}>
                      <Col span={4}>
                        <PhoneFilled />
                      </Col>
                      <Col span={20}>{user.phone}</Col>
                      <Col span={4}>
                        <MailFilled />
                      </Col>
                      <Col span={20}>{user.email}</Col>
                    </ProfileDescription>
                  </Col>
                </Row>
                <Row gutter={[8, 8]}>
                  <Col offset={10} span={14}>
                    <Row gutter={[8, 8]}>
                      <Col span={8}>
                        <IconButton
                          type="primary"
                          shape="circle"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            history.push('/users/' + user.id);
                          }}
                        />
                      </Col>
                      <Col span={8}>
                        <IconButton
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => {
                            history.push({
                              pathname: '/users/' + user.id,
                              state: { edit: true },
                            });
                          }}
                        />
                      </Col>
                      <Col span={8}>
                        <IconButton
                          danger
                          shape="circle"
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            setDeleteModal({ open: true, id: user.id });
                          }}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </ListItem>
            )}
          />
          {isMore &&
            (moreLoading ? (
              <LoadMore>
                <Spin indicator={<LoadingOutlined />} size="large" />
              </LoadMore>
            ) : (
              <LoadMore></LoadMore>
            ))}
        </>
      ) : (
        <Row align="middle" justify="center">
          <Col span={24}>
            <Row justify="end">
              <OptionButton>
                <Button
                  size="large"
                  type="primary"
                  onClick={() => history.push('/create-user')}
                >
                  {t(UsersMessages.createUserButton())}
                </Button>
              </OptionButton>
              <OptionButton>
                <Button size="large">
                  <CSVLink
                    filename={'users-page-' + tablePagination.current + '.csv'}
                    data={data}
                  >
                    {t(UsersMessages.exportCSV())}
                  </CSVLink>
                </Button>
              </OptionButton>
              <OptionButton>
                <ButtonImport size="large">
                  <CSVReader
                    cssClass="react-csv-input"
                    label={t(UsersMessages.importCSV())}
                    inputStyle={{ display: 'none' }}
                    onFileLoaded={handleForce}
                    parserOptions={papaparseOptions}
                  />
                </ButtonImport>
              </OptionButton>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              columns={columns}
              rowKey="id"
              dataSource={data}
              pagination={tablePagination}
              loading={loading}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
            />
          </Col>
        </Row>
      )}
      <DeleteModal
        open={deleteModal.open}
        cancelText={t(UsersMessages.modalFormCancelButton())}
        deleteText={t(UsersMessages.modalFormDeleteButton())}
        content={t(UsersMessages.modalFormDeleteContent())}
        handleCancel={() => setDeleteModal({ open: false, id: '' })}
        handleDelete={handleDelete}
      />
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
    </>
  );
};

export default Users;

const IconButton = styled(Button)`
  margin: 5px;
  span {
    position: absolute !important;
    width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
`;

const OptionButton = styled(Col)`
  margin-left: 1em;
  margin-bottom: 1em;
`;
const ButtonImport = styled(Button)`
  label:hover {
    cursor: pointer;
  }
`;

const ListItem = styled(List.Item)``;

const ProfileDescription = styled(Row)`
  color: gray;
`;

const LoadMore = styled.div`
  height: 100px;
  width: 100%;
  text-align: center;

  div {
    font-size: xxx-large;
  }
`;

const FormItem = styled(Form.Item)`
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;
