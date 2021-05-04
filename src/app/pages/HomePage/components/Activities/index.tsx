import { Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import { TitlePage } from 'app/components/TitlePage';
import moment from 'moment';
import * as React from 'react';
import styled from 'styled-components/macro';

const data = [
  {
    id: 1,
    type: 'calendar',
    date: '2020-03-08',
    content: "International Women's Day",
  },
  {
    id: 2,
    type: 'calendar',
    date: '2020-04-30',
    content: 'Reunification Day',
  },
  {
    id: 3,
    type: 'mail',
    date: '2020-09-02',
    content: 'The independent Day of Vietnam',
  },
  {
    id: 4,
    type: 'mail',
    date: '2021-04-25',
    content: "Coronavirus: 'Double mutant' Covid variant found in India",
  },
];

export const Activities = () => {
  return (
    <>
      <CardWrapper
        mainHeight="328px"
        bodyHeight="250px"
        title={<TitlePage>Activities</TitlePage>}
      >
        {data &&
          data.map(item => {
            return (
              <RowItem key={item.id} gutter={[32, 32]} align="middle">
                <Col span={3}>{item.type}</Col>
                <Col span={4}>{moment(item.date).format('D MMMM')}</Col>
                <Col span={17}>{item.content}</Col>
              </RowItem>
            );
          })}
      </CardWrapper>
    </>
  );
};

const RowItem = styled(Row)`
  height: 68px;
`;
