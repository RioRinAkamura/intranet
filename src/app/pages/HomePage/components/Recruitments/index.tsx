import { Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import { PageTitle } from 'app/components/PageTitle';
import * as React from 'react';
import styled from 'styled-components/macro';

const data = [
  {
    id: 1,
    qty: 6,
    position: 'Senior & Junior React Native',
    bonus: '$300',
  },
  {
    id: 2,
    qty: 6,
    position: 'Android Developer',
    bonus: '$300',
  },
  {
    id: 3,
    qty: 3,
    position: 'Python',
    bonus: '$300',
  },
  {
    id: 4,
    qty: 3,
    position: 'PHP',
    bonus: '$300',
  },
];

export const Recruitments = () => {
  return (
    <>
      <CardWrapper
        mainHeight="328px"
        bodyHeight="250px"
        title={
          <PageTitle style={{ textAlign: 'right' }}>Recruitment News</PageTitle>
        }
      >
        <RowItem gutter={[32, 0]} align="middle">
          <Col offset={8} span={3}>
            QTY
          </Col>
          <Col span={10}>POSITION</Col>
          <Col span={3}>BONUS</Col>
        </RowItem>
        {data &&
          data.map(item => {
            return (
              <RowItem key={item.id} gutter={[32, 0]} align="middle">
                <Col offset={8} span={3}>
                  {item.qty}
                </Col>
                <Col span={10}>{item.position}</Col>
                <Col span={3}>{item.bonus}</Col>
              </RowItem>
            );
          })}
      </CardWrapper>
    </>
  );
};

const RowItem = styled(Row)``;
