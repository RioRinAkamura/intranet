/**
 *
 * DetailForm
 *
 */
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Col, Form, FormInstance, Input, Row } from 'antd';
import { CardLayout } from 'app/components/CardLayout';
import React, { memo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import { AvatarPath } from '../AvatarPath/Loadable';
import { BankAccountsDetail } from '../BankAccounts/components/BankAccountsDetail';
import { IdCardInfoDetail } from '../IdCardInfo/components/IdCardInfoDetail';
import { JobInfoDetail } from '../JobInfo/components/JobInfoDetail';
import { ProfileInfoDetail } from '../ProfileInfo/components/ProfileInfoDetail';
import { SocialNetworkDetail } from '../SocialNetwork/components/SocialNetworkDetail';

type Employee = models.hr.Employee;

interface FormProps {
  form: FormInstance;
  isView: boolean;
  isEdit: boolean;
  data?: Employee;
  leftScreenItems?: React.ReactNode;
  rightScreenItems?: React.ReactNode;
}

export const DetailForm = memo((props: FormProps) => {
  const {
    form,
    isView,
    isEdit,
    data,
    leftScreenItems,
    rightScreenItems,
  } = props;
  const location = useLocation();
  const { pathname } = location;

  // is tab: "Bank Accounts"
  return pathname.includes('employees') &&
    pathname.includes('bank-accounts') ? (
    <Form form={form} labelAlign="left">
      <Wrapper isView={isView}>
        <Form.Item hidden name="id">
          <Input hidden />
        </Form.Item>
        <Row gutter={[32, 32]}>
          <RightScreen isView={isView} md={19}>
            {isView && rightScreenItems}
            {!isView && (
              <>
                <BankAccountsDetail isView={isView} isEdit={isEdit} />
              </>
            )}
          </RightScreen>
        </Row>
      </Wrapper>
    </Form>
  ) : // is tab: "Contract"
  pathname.includes('employees') && pathname.includes('contract') ? (
    <Form form={form} labelAlign="left">
      <WrapperSubItem gutter={[64, 32]}>
        <Col span={isView ? 24 : 24}>
          <WrapperItem>
            <Form.Item hidden name="id">
              <Input hidden />
            </Form.Item>
            <JobInfoDetail
              form={form}
              isEdit={isEdit}
              isView={isView}
              employeeId={data?.id}
            />
          </WrapperItem>
        </Col>
      </WrapperSubItem>
    </Form>
  ) : // is tab: "Cityzen-info"
  pathname.includes('employees') && pathname.includes('citizen-info') ? (
    <Form form={form} labelAlign="left">
      <Wrapper isView={isView}>
        <Col span={isView ? 24 : 24}>
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <Row gutter={[32, 32]}>
            <RightScreen isView={isView} md={19}>
              {isView && rightScreenItems}
              {!isView && (
                <>
                  <IdCardInfoDetail isView={isView} isEdit={isEdit} />
                </>
              )}
            </RightScreen>
          </Row>
        </Col>
      </Wrapper>
    </Form>
  ) : //is Tab: Social Accounts
  pathname.includes('employees') && pathname.includes('social-accounts') ? (
    <Form form={form} labelAlign="left">
      <Wrapper isView={isView}>
        <Col span={isView ? 24 : 24}>
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <Row gutter={[32, 32]}>
            <RightScreen isView={isView} md={19}>
              {isView && rightScreenItems}
              {!isView && (
                <>
                  <SocialNetworkDetail isView={isView} isEdit={isEdit} />
                </>
              )}
            </RightScreen>
          </Row>
        </Col>
      </Wrapper>
    </Form>
  ) : (
    //is Tab: Details
    <Form form={form} labelAlign="left">
      <Form.Item hidden name="id">
        <Input hidden />
      </Form.Item>
      <Wrapper isView={isView}>
        <Row gutter={[32, 32]}>
          <LeftScreen md={5}>
            <AvatarPath
              user={data}
              isView={isView}
              isEdit={isEdit}
              form={form}
            />
            {leftScreenItems}
          </LeftScreen>
          <RightScreen isView={isView} md={19}>
            {isView && rightScreenItems}
            {!isView && (
              <>
                <ProfileInfoDetail isView={isView} isEdit={isEdit} />
              </>
            )}
          </RightScreen>
        </Row>
      </Wrapper>
    </Form>
  );
});

interface ScreenProps {
  isView?: boolean;
}

const LeftScreen = styled(Col)``;

const RightScreen = styled(Col)<ScreenProps>`
  padding-left: ${props => (props.isView ? '5em !important' : '0')};
`;

const WrapperSubItem = styled(Row)`
  @media screen and (max-width: 768px) {
    flex-direction: column;
    .ant-col {
      max-width: 100%;
    }
  }
`;

const Wrapper = styled(CardLayout)`
  margin-top: ${(props: ScreenProps) => (props.isView ? '0' : '0rem')};
`;

const WrapperItem = styled(CardLayout)`
  padding: 3em 3em 1em 3em;
  margin: 0;
`;
