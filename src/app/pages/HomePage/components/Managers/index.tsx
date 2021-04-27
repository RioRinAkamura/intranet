import { Avatar, Card, Col, Row } from 'antd';
import { CardWrapper } from 'app/components/CardWrapper';
import { Title } from 'app/components/Title';
import * as React from 'react';
import styled from 'styled-components/macro';

export const Managers = () => {
  return (
    <>
      <CardWrapper title={<Title>Managers</Title>}>
        <Row gutter={[32, 32]} align="middle" justify="space-between">
          <Col>
            <Avatar src="#" size={130} />
            <Info>
              <Name>Hung Luu</Name>
              <Role>Director</Role>
            </Info>
          </Col>
          <Col>
            <Avatar src="#" size={130} />
            <Info>
              <Name>Dat Giang</Name>
              <Role>CEO</Role>
            </Info>
          </Col>
          <Col>
            <Avatar src="#" size={130} />
            <Info>
              <Name>Quynh Le</Name>
              <Role>CTO</Role>
            </Info>
          </Col>
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
