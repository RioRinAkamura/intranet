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
} from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  MailFilled,
  PhoneFilled,
  PlusOutlined,
  SearchOutlined,
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

const FormItem = Form.Item;
const { Panel } = Collapse;

const getBase64 = (img: Blob, callback: Function) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: File) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

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
  const [userProfile, setUserProfile] = useState<UserProfile>();
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
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [isMore, setIsMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [openModal, setOpenModal] = useState({ open: false, mode: '' });
  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '' });
  const [previewModal, setPreviewModal] = useState({ open: false, data: [] });
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [imageURL, setImageURL] = useState('');

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
          placeholder={`Search ${dataIndex}`}
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
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
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
            Filter
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
      title: 'Avatar',
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
      title: 'First Name',
      dataIndex: 'first_name',
      sorter: {
        compare: (a, b) => a.first_name.localeCompare(b.first_name),
        multiple: 2,
      },
      ...getColumnSearchProps('first_name'),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      sorter: {
        compare: (a, b) => a.last_name.localeCompare(b.last_name),
        multiple: 1,
      },
      ...getColumnSearchProps('last_name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Options',
      dataIndex: 'id',
      render: (text, record: UserProfile, index: number) => {
        return (
          <>
            <Tooltip title="View">
              <IconButton
                type="primary"
                size="large"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => {
                  setUserProfile({ ...record });
                  setViewModal(true);
                }}
              />
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="large"
                shape="circle"
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    ...record,
                  });
                  setOpenModal({ open: true, mode: 'edit' });
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
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

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoadingUpload(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageURL => {
        setImageURL(imageURL);
        setLoadingUpload(false);
        form.setFieldsValue({ avatar: imageURL });
      });
    }
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        if (openModal.mode === 'create') {
          dispatch(actions.createUser(values));
        } else {
          dispatch(actions.editUser(values));
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setImageURL('');
    setLoadingUpload(false);
    setOpenModal({ open: false, mode: '' });
  };

  const uploadButton = (
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
      <h1>Users Page</h1>
      <Collapse style={{ margin: '1em 0 1em 0' }}>
        <Panel header="Search" key="1">
          <Form
            form={searchForm}
            labelCol={{ xxl: 6, xl: 8, lg: 6, md: 8, xs: 6 }}
            wrapperCol={{ xxl: 18, xl: 16, lg: 18, md: 16, xs: 18 }}
          >
            <Row gutter={[8, 8]}>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem name="first_name" label="First Name">
                  <Input placeholder="Search by first name" />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem name="last_name" label="Last Name">
                  <Input placeholder="Search by last name" />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem name="email" label="Email">
                  <Input placeholder="Search by email" />
                </FormItem>
              </Col>
              <Col xl={6} lg={12} md={12} sm={24} xs={24}>
                <FormItem name="phone" label="Phone Number">
                  <Input placeholder="Search by phone number" />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={[8, 8]} justify="end">
              <Col>
                <Button type="primary" onClick={totalSearch}>
                  Search
                </Button>
              </Col>
              <Col>
                <Button onClick={resetTotalSearch}>Reset</Button>
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
                            setUserProfile({ ...user });
                            setViewModal(true);
                          }}
                        />
                      </Col>
                      <Col span={8}>
                        <IconButton
                          shape="circle"
                          icon={<EditOutlined />}
                          onClick={() => {
                            form.setFieldsValue({
                              ...user,
                            });
                            setOpenModal({ open: true, mode: 'edit' });
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
                  onClick={() => setOpenModal({ open: true, mode: 'create' })}
                >
                  Create User
                </Button>
              </OptionButton>
              <OptionButton>
                <Button size="large">
                  <CSVLink
                    filename={'users-page-' + tablePagination.current + '.csv'}
                    data={data}
                  >
                    Export as CSV
                  </CSVLink>
                </Button>
              </OptionButton>
              <OptionButton>
                <ButtonImport size="large">
                  <CSVReader
                    cssClass="react-csv-input"
                    label="Import CSV"
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
      <DialogModal
        title={`${
          openModal.mode.charAt(0).toUpperCase() + openModal.mode.slice(1)
        } User`}
        isOpen={openModal.open}
        handleCancel={handleCancel}
        okText="Save"
        footer={[
          <Button key="onCancel" size="large" onClick={handleCancel}>
            Cancel
          </Button>,
          openModal.mode !== 'view' && (
            <Button key="onSave" size="large" type="primary" onClick={handleOk}>
              Save
            </Button>
          ),
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <FormItem hidden name="id" />
          <FormItem
            label="Avatar"
            name="avatar"
            valuePropName="file"
            rules={[{ required: true, message: 'Please upload your avatar!' }]}
          >
            <Upload
              disabled={openModal.mode === 'view'}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
              accept="image/png, image/jpeg, image/jpg"
            >
              {imageURL || form.getFieldValue('avatar') ? (
                <img
                  src={imageURL || form.getFieldValue('avatar')}
                  alt="avatar"
                  style={{ width: '100%' }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </FormItem>
          <FormItem
            label="First Name"
            name="first_name"
            rules={[
              {
                required: true,
                message: 'Please input user fisrt name!',
              },
            ]}
          >
            <Input disabled={openModal.mode === 'view'} />
          </FormItem>
          <FormItem
            label="Last Name"
            name="last_name"
            rules={[
              {
                required: true,
                message: 'Please input user last name!',
              },
            ]}
          >
            <Input disabled={openModal.mode === 'view'} />
          </FormItem>
          <FormItem
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input user email!',
              },
            ]}
          >
            <Input disabled={openModal.mode === 'view'} />
          </FormItem>
        </Form>
      </DialogModal>
      <DialogModal
        title="User Profile"
        isOpen={viewModal}
        handleCancel={() => setViewModal(false)}
        footer={null}
      >
        {userProfile && (
          <>
            <ProfileAvatar>
              <Avatar src={userProfile.avatar} size={150} />
              <h2>{userProfile.first_name + ' ' + userProfile.last_name}</h2>
            </ProfileAvatar>
            <ProfileDescription gutter={[16, 16]} justify="center">
              <ProfileBody span={2}>
                <PhoneFilled />
              </ProfileBody>
              <ProfileBody span={14}>{userProfile.phone}</ProfileBody>
            </ProfileDescription>
            <ProfileDescription gutter={[16, 16]} justify="center">
              <ProfileBody span={2}>
                <MailFilled />
              </ProfileBody>
              <ProfileBody span={14}>{userProfile.email}</ProfileBody>
            </ProfileDescription>
          </>
        )}
      </DialogModal>
      <DeleteModal
        open={deleteModal.open}
        handleCancel={() => setDeleteModal({ open: false, id: '' })}
        handleDelete={handleDelete}
      />
      <DialogModal
        title="Preview Import File"
        isOpen={previewModal.open}
        handleCancel={() => {
          setPreviewModal({ open: false, data: [] });
        }}
        okText="Save"
        footer={[
          <Button
            key="onCancel"
            size="large"
            onClick={() => setPreviewModal({ open: false, data: [] })}
          >
            Cancel
          </Button>,
          openModal.mode !== 'view' && (
            <Button
              key="onSave"
              size="large"
              type="primary"
              onClick={handleImport}
            >
              Save
            </Button>
          ),
        ]}
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

const ModalTitle = styled.h1`
  text-align: center;
`;

const FormTitle = styled(Col)`
  text-align: right;
`;

const ButtonImport = styled(Button)`
  label:hover {
    cursor: pointer;
  }
`;

const ListItem = styled(List.Item)``;

const ProfileAvatar = styled.div`
  text-align: center;
`;

const ProfileBody = styled(Col)`
  text-align: center;
`;

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
