import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from 'app/components/PageWrapper';
import { PieChartOutlined } from '@ant-design/icons';
import styled from 'styled-components/macro';
// import { Chart } from './components/Chart';
import { Col, Row } from 'antd';
// import { Managers } from './components/Managers';
// import { Activities } from './components/Activities';
// import { PerformanceEmployees } from './components/PerformanceEmployees';
// import { NewEmployees } from './components/NewEmployees';
// import { Recruitments } from './components/Recruitments';
import PageTitle from 'app/components/PageTitle';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';

export const HomePage: React.FC = () => {
  const { setBreadCrumb } = useBreadCrumbContext();

  React.useEffect(() => {
    setBreadCrumb('');
  }, [setBreadCrumb]);

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta
          name="description"
          content="A mini tool for managing HD's staffs"
        />
      </Helmet>
      <PageWrapper>
        <TitleWrapper>
          <PieChartOutlined />
          <PageTitle title="Dashboard" />
        </TitleWrapper>
        <WrapperItem>{/* <Chart /> */}</WrapperItem>
        <WrapperItem>{/* <Managers /> */}</WrapperItem>
        <WrapperItem>
          <Row gutter={[32, 32]}>
            <Col span={12}>{/* <Recruitments /> */}</Col>
            <Col span={12}>{/* <Activities /> */}</Col>
          </Row>
        </WrapperItem>
        <WrapperItem>
          <Row gutter={[32, 32]}>
            <Col span={12}>{/* <PerformanceEmployees /> */}</Col>
            <Col span={12}>{/* <NewEmployees /> */}</Col>
          </Row>
        </WrapperItem>
      </PageWrapper>
    </>
  );
};

const TitleWrapper = styled.div`
  margin: 1rem 0;
  display: flex;
  font-weight: 500;
  align-items: center;
  background-color: white;
  padding: 1rem;
  /* box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16); */
  border-radius: 10px;

  span {
    margin: 0 15px;
    font-size: 26px;
    font-weight: bold;
    color: rgb(112, 112, 112);
  }
`;

const WrapperItem = styled.div`
  margin: 1rem 0;
`;
