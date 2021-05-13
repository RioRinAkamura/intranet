import { Col, Row } from 'antd';
import * as React from 'react';
import styled from 'styled-components/macro';
import img1 from '../../assets/totalEmployees.png';
import img2 from '../../assets/totalProject.png';
import img3 from '../../assets/totalNumberofDays.png';

export const Chart = () => {
  return (
    <>
      <Row gutter={[32, 32]}>
        <ColItem span={8}>
          <DIV backgroundimg={img1}>
            <DataRow align="middle" justify="space-between">
              <Col>Total Employees</Col>
              <Col>
                <NumberCircle>150</NumberCircle>
              </Col>
            </DataRow>
          </DIV>
        </ColItem>
        <ColItem span={8}>
          <DIV backgroundimg={img2}>
            <DataRow align="middle" justify="space-between">
              <Col>Total Projects</Col>
              <Col>
                <NumberCircle>150</NumberCircle>
              </Col>
            </DataRow>
          </DIV>
        </ColItem>
        <ColItem span={8}>
          <DIV backgroundimg={img3}>
            <DataRow align="middle" justify="space-between">
              <Col>Total Number of Days Allowed</Col>
              <Col>
                <NumberCircle>150</NumberCircle>
              </Col>
            </DataRow>
          </DIV>
        </ColItem>
      </Row>
    </>
  );
};

type PageProps = {
  backgroundimg: string;
};

const ColItem = styled(Col)`
  height: 265px;
`;

const DIV = styled.div`
  width: 100%;
  height: 100%;
  background: ${(props: PageProps) =>
    props.backgroundimg && `url(${props.backgroundimg}) no-repeat`};
  background-size: 535px 270px;
  background-position-x: center;
  background-position-y: initial;
  position: relative;
`;

const DataRow = styled(Row)`
  position: absolute;
  width: 100%;
  bottom: 0px;
  color: white;
  font-weight: 500;
  font-size: larger;
  padding: 1.5em 2em;
`;

const NumberCircle = styled.div`
  color: black;
  padding: 9px 5px;
  background-color: white;
  border-radius: 2em;
`;
