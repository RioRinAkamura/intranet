import { Helmet } from 'react-helmet-async';
import React, { useEffect } from 'react';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { Col, Row, Table } from 'antd';
import { useDeviceHistory } from './useDeviceHistory';
import { DeviceHistory as DeviceHistoryType } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

interface DeviceHistoryProps {
  device_id: string;
}

export const DeviceHistory = (props: DeviceHistoryProps) => {
  const { device_id } = props;
  const { histories, loading, fetchHistories } = useDeviceHistory();

  useEffect(() => {
    if (device_id) {
      fetchHistories(device_id);
    }
  }, [device_id, fetchHistories]);

  const columns: ColumnProps<DeviceHistoryType>[] = [
    {
      title: 'Employee',
      dataIndex: 'consignee',
      width: 350,
      render: text => text.first_name + ' ' + text.last_name,
    },
    {
      title: 'Device',
      dataIndex: 'device',
      width: 350,
      render: text => text.code,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render: text => text,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Device Manager Page</title>
        <meta name="description" content={'Device History'} />
      </Helmet>
      <Wrapper>
        <Row align="middle" justify="center">
          <Col span={24}>
            <TableWrapper>
              <Table
                loading={loading}
                columns={columns}
                rowKey="id"
                dataSource={histories.results}
                scroll={{ x: 1100 }}
              />
            </TableWrapper>
          </Col>
        </Row>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

const TableWrapper = styled.div`
  .avatar {
    padding: 1em 0;
  }

  .ant-pagination-options {
    order: -1;
    margin-right: 1em;
    margin-left: 0;
  }

  .ant-pagination-total-text {
    margin-inline-end: auto;
    span {
      color: blue;
    }
  }

  .totalAllocated {
    white-space: break-spaces;
  }
`;
