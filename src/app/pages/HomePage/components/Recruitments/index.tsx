import { Badge, Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import PageTitle from 'app/components/PageTitle';
import * as React from 'react';
import styled from 'styled-components/macro';
import background from '../../assets/BG.png';

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
        backgroundimg={background}
        // mainheight="328px"
        bodyheight="237px"
        title={<PageTitle title="Recruitment News" />}
      >
        <RowHeader gutter={[32, 0]} align="middle">
          <Col offset={10} span={3}></Col>
          <Col span={8}>POSITION</Col>
          <Col span={3}>BONUS</Col>
        </RowHeader>
        {data &&
          data.map(item => {
            return (
              <RowItem key={item.id} gutter={[32, 0]} align="middle">
                <Col offset={10} span={3}>
                  <Badge
                    style={{ backgroundColor: '#1fa9e0' }}
                    count={item.qty}
                  />
                </Col>
                <Col span={8}>{item.position}</Col>
                <Col span={3}>{item.bonus}</Col>
              </RowItem>
            );
          })}
      </CardWrapper>
    </>
  );
};

const RowHeader = styled(Row)`
  color: rgb(31 169 224);
  font-weight: bold;
`;
const RowItem = styled(Row)`
  margin: 1em 0;
`;
