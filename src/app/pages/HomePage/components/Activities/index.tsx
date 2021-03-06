import { Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import PageTitle from 'app/components/PageTitle';
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
        // mainheight="328px"
        bodyheight="237px"
        title={<PageTitle title="Activities" />}
      >
        {data &&
          data.map(item => {
            return (
              <RowItem key={item.id} gutter={[32, 32]} align="middle">
                <Col span={4}>{item.type}</Col>
                <Col span={6}>{moment(item.date).format('D MMMM')}</Col>
                <Col span={14}>{item.content}</Col>
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
