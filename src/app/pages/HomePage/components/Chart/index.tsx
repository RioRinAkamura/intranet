import { Col, Row } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';
import img1 from '../../assets/totalEmployees.png';
import img2 from '../../assets/totalNumberofDays.png';
import img3 from '../../assets/totalProject.png';

export const Chart = () => {
  return (
    <>
      <Row gutter={[32, 32]}>
        <ColItem span={8}>
          <img src={img1} alt="Total Employee" />
        </ColItem>
        <ColItem span={8}>
          <img src={img2} alt="Total Project" />
        </ColItem>
        <ColItem span={8}>
          <img src={img3} alt="Total Number of Days Allowed" />
        </ColItem>
      </Row>
    </>
  );
};

const ColItem = styled(Col)`
  img {
    height: 100%;
    width: 100%;
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
    border-radius: 1em;
  }
`;
