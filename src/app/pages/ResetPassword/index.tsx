import { LockTwoTone } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { ResetForm } from './components/ResetForm';
import { ResetPageMessages } from './messages';

export const ResetPassword: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Helmet>
        <title>{t(ResetPageMessages.title())}</title>
        <meta name="description" content={t(ResetPageMessages.description())} />
      </Helmet>
      <ForgotWrapper justify="center" align="middle">
        <Form xxl={6} xl={8} lg={10} xs={21}>
          <Title>
            <h1>{t(ResetPageMessages.formTitle())}</h1>
          </Title>
          <Description>
            <div>
              <LockTwoTone />
            </div>
          </Description>
          <ResetForm />
        </Form>
      </ForgotWrapper>
    </Wrapper>
  );
};

export default ResetPassword;

const Title = styled.div`
  text-align: center;
`;

const ForgotWrapper = styled(Row)`
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: auto;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
`;

const Form = styled(Col)`
  background-color: #fff;
  padding: 2em;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgb(0 0 0 / 30%);
`;

const Wrapper = styled.div`
  background-color: #ececec;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Description = styled.div`
  text-align: center;
  color: gray;
  width: 75%;
  margin: 0 auto;
  span {
    font-size: 100px;
    margin: 20px 0;
  }
`;
