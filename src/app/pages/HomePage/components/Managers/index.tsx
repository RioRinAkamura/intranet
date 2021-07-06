import { Avatar, Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import PageTitle from 'app/components/PageTitle';
import * as React from 'react';
import styled from 'styled-components/macro';

const managers = [
  {
    id: 1,
    name: 'Hung Luu',
    role: 'Director',
    avatar: 'https://randomuser.me/api/portraits/men/17.jpg',
  },
  {
    id: 2,
    name: 'Dat Giang',
    role: 'CEO',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: 3,
    name: 'Quynh Le',
    role: 'CTO',
    avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
  },
  {
    id: 4,
    name: 'Son Huynh',
    role: 'PM',
    avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
  },
  {
    id: 5,
    name: 'Vu Tran',
    role: 'PM',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
  },
];

export const Managers = () => {
  return (
    <>
      <CardWrapper
        // mainheight="328px"
        bodyheight="250px"
        title={<PageTitle title="Managers" />}
      >
        <Row gutter={[32, 32]} align="middle" justify="space-between">
          {managers &&
            managers.map(manager => {
              return (
                <Col key={manager.id}>
                  <Avatar src={manager.avatar} size={130} />
                  <Info>
                    <Name>{manager.name}</Name>
                    <Role>{manager.role}</Role>
                  </Info>
                </Col>
              );
            })}
        </Row>
      </CardWrapper>
    </>
  );
};

const Info = styled.div`
  text-align: center;
  margin-top: 1rem;
`;

const Name = styled.div`
  color: rgb(31 169 224);
  font-size: 20px;
  line-height: 25px;
`;

const Role = styled.div`
  color: rgb(172 172 172);
`;
