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
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { request } from 'utils/request';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { DeleteModal } from 'app/components/DeleteModal';
import { useUserspageSlice } from './slice';
import { CSVLink } from 'react-csv';
import CSVReader from 'react-csv-reader';

const FormItem = Form.Item;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
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
}

export const Users: React.FC = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [openModal, setOpenModal] = useState({ open: false, mode: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [form] = Form.useForm();
  const [imageURL, setImageURL] = useState('');

  const { actions } = useUserspageSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData({ pagination });
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination,
      ...filters,
    });
  };

  const fetchData = (params: any) => {
    setLoading(true);
    request(
      'https://reqres.in/api/users?page=' + params.pagination.current,
    ).then((response: any) => {
      setData(response.data);
      pagination.total = response.total;
      pagination.current = params.pagination.current;
      setPagination({
        ...pagination,
        total: response.total,
        current: params.pagination.current,
      });
      setLoading(false);
    });
  };

  const getColumnSearchProps = dataIndex => ({
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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (text, record) => (
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
      sorter: (a, b) => a.first_name.localeCompare(b.first_name),
      ...getColumnSearchProps('first_name'),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      sorter: (a, b) => a.last_name.localeCompare(b.last_name),
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
      render: (text, record, index) => {
        return (
          <>
            <Tooltip title="View">
              <IconButton
                type="primary"
                size="large"
                shape="circle"
                icon={<EyeOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    ...record,
                  });
                  setOpenModal({ open: true, mode: 'view' });
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
                  setDeleteModal(true);
                }}
              />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoadingUpload(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
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
        dispatch(actions.createUser(values));
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

  const handleForce = (data, fileInfo) => console.log(data, fileInfo);

  const papaparseOptions = {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: header => header.toLowerCase().replace(/\W/g, '_'),
  };

  return (
    <Row gutter={[8, 8]} align="middle" justify="center">
      <Col span={24}>
        <h1>Users Page</h1>
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button
              size="large"
              type="primary"
              onClick={() => setOpenModal({ open: true, mode: 'create' })}
            >
              Create User
            </Button>
          </Col>
          <Col>
            <Button size="large">
              <CSVLink
                filename={'users-page-' + pagination.current + '.csv'}
                data={data}
              >
                Export as CSV
              </CSVLink>
            </Button>
          </Col>
          <Col>
            <Button size="large">
              <CSVReader
                cssClass="react-csv-input"
                label="Import CSV"
                inputStyle={{ display: 'none' }}
                onFileLoaded={handleForce}
                parserOptions={papaparseOptions}
              />
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Table
          columns={columns}
          rowKey={(record: any) => {
            console.log(record.id)
            return record.id;
          }}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
        />
      </Col>
      <Modal
        title={
          <ModalTitle>
            {openModal.mode.charAt(0).toUpperCase() + openModal.mode.slice(1)}{' '}
            User
          </ModalTitle>
        }
        visible={openModal.open}
        centered
        onCancel={handleCancel}
        okText="Save"
        footer={[
          <Button size="large" onClick={handleCancel}>
            Cancel
          </Button>,
          openModal.mode !== 'view' && (
            <Button size="large" type="primary" onClick={handleOk}>
              Save
            </Button>
          ),
        ]}
      >
        <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
      </Modal>
      <DeleteModal
        open={deleteModal}
        handleCancel={() => setDeleteModal(false)}
      />
    </Row>
  );
};

export default Users;
// const Wrapper = styled.div`
//   width: 960px;
//   margin: 0 auto;
// `;

// const Title = styled.h1``;

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

const ModalTitle = styled.h1`
  text-align: center;
`;
