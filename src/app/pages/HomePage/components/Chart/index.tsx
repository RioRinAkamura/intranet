import { Col, Row } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';

export const Chart = () => {
  return (
    <>
      <Row gutter={[32, 32]}>
        <ColItem span={8}>
          <img src="https://i.imgur.com/OMbGIAk.png" alt="Total Employee" />
        </ColItem>
        <ColItem span={8}>
          <img src="https://i.imgur.com/WbJiicG.png" alt="Total Project" />
        </ColItem>
        <ColItem span={8}>
          <img
            src="https://i.imgur.com/KnMhqev.png"
            alt="Total Number of Days Allowed"
          />
        </ColItem>
      </Row>
    </>
  );
};

const ColItem = styled(Col)`
  img {
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    border-radius: 1em;
  }
`;
