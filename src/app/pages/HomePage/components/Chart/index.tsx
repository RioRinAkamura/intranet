import { Line } from '@ant-design/charts';
import { LineConfig } from '@ant-design/charts/es/line';
import { Badge, Col, Row } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';

export const Chart = () => {
  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ];

  const config: LineConfig = {
    data,
    height: 250,
    width: 500,
    xField: 'year',
    yField: 'value',
    color: '#fff',
    point: {
      size: 5,
      shape: 'diamond',
    },
    xAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#fff',
        },
      },
    },
  };

  return (
    <>
      <Row gutter={[32, 32]}>
        <Col span={8}>
          <Chart1>
            <Line {...config} />
            <Row gutter={[8, 8]} justify="space-between">
              <Col>Total Employees</Col>
              <Col>
                <Badge count={100} overflowCount={1000} />
              </Col>
            </Row>
          </Chart1>
        </Col>
        <Col span={8}>
          <Line {...config} />
        </Col>
        <Col span={8}>
          <Line {...config} />
        </Col>
      </Row>
    </>
  );
};

const Chart1 = styled.div`
  padding: 1rem;
  background-image: linear-gradient(
    rgb(32, 193, 233) 0%,
    rgb(52, 215, 255) 100%
  );
`;
