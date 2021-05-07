import { Avatar, Col, DatePicker, Row, Table } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import { PageTitle } from 'app/components/PageTitle';
import moment from 'moment';
import * as React from 'react';
import styled from 'styled-components/macro';

export const PerformanceEmployees = () => {
  const columns = [
    {
      dataIndex: 'avatar',
      key: 'avatar',
      render: text => <Avatar src={text} size={50} />,
    },
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'CODE',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  const data = [
    {
      id: '1',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      name: 'John Brown',
      role: 'React JS',
      code: '123-456-789',
      email: 'johnbrown@gmail.com',
    },
    {
      id: '2',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      name: 'Jim Green',
      role: 'React Native',
      code: '987-654-321',
      email: 'jimgreen@gmail.com',
    },
    {
      id: '3',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      name: 'Joe Black',
      role: 'Angular',
      code: '321-654-987',
      email: 'joeblack@gmail.com',
    },
    {
      id: '4',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
      name: 'Jason Blue',
      role: 'Vue JS',
      code: '789-456-123',
      email: 'jasonblue@gmail.com',
    },
  ];

  const onChange = (date: moment.Moment | null, dateString: string) => {
    console.log(dateString);
  };

  const disabledDate = (current: moment.Moment) => {
    return current && current > moment().endOf('day');
  };

  return (
    <>
      <CardWrapper
        mainheight="500px"
        bodyheight="435px"
        title={
          <>
            <Row justify="space-between">
              <Col>
                <PageTitle>Top Performance Employees</PageTitle>
              </Col>
              <Col>
                <CustomDatePicker
                  size="large"
                  bordered={false}
                  disabledDate={disabledDate}
                  onChange={onChange}
                  picker="month"
                />
              </Col>
            </Row>
          </>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          columns={columns}
          pagination={false}
        />
      </CardWrapper>
    </>
  );
};

const CustomDatePicker = styled(DatePicker)`
  input {
    display: none;
  }
  svg {
    font-size: 20px;
  }
`;
