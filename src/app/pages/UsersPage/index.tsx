import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter: true,
    render: name => `${name.first} ${name.last}`,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
];

export const Users: React.FC = () => {
  const [data, setData] = useState([]);
  const [pagination, setPageination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);

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

  const fetchData = (params = {}) => {
    setLoading(true);
    fetch('https://reqres.in/api/users')
      .then((res: any) => {
        const data = JSON.parse(res);
        console.log(data);
        setData(res.data);
      })
      .catch();
  };

  return (
    <Table
      columns={columns}
      rowKey={(record: any) => record.login.uuid}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default Users;

// const Wrapper = styled.div`
//   width: 960px;
//   margin: 0 auto;
// `;

// const Title = styled.h1``;
