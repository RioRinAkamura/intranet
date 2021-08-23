import { Helmet } from 'react-helmet-async';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { ColumnProps } from 'antd/lib/table';
import { Col, Row, Table } from 'antd';
import { api } from 'utils/api';

interface DeviceHistoryType {
  user: string;
  employee: string;
  note: string;
}

interface DeviceHistoryProps {
  device_id: string;
}

export const DeviceHistory = ({ device_id }: DeviceHistoryProps) => {
  const [histories, setHistories] = useState<DeviceHistoryType[]>([]);
  const fetchListHistory = useCallback(async () => {
    const histories: any = await api.hr.deviceHistory.list('', {
      device: device_id,
    });

    setHistories(histories.results);
  }, [device_id]);

  useEffect(() => {
    fetchListHistory();
  }, [fetchListHistory]);

  const columns: ColumnProps<DeviceHistoryType>[] = [
    {
      title: 'Employee',
      dataIndex: 'employee_name',
      width: 130,
      render: text => text,
    },
    {
      title: 'Device',
      dataIndex: 'device_code',
      width: 130,
      render: text => text,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      width: 130,
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
                columns={columns}
                rowKey="id"
                dataSource={histories}
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
