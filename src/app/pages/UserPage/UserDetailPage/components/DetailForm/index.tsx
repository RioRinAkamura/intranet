/**
 *
 * DetailForm
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { Col, Divider, Form, FormInstance, Input, Row } from 'antd';
import { AvatarPath } from '../AvatarPath/Loadable';
import { BankAccounts } from '../BankAccounts/Loadable';
import { IdCardInfo } from '../IdCardInfo/Loadable';
import { JobInfo } from '../JobInfo/Loadable';
import { SocialNetwork } from '../SocialNetwork/Loadable';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

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

  return (
    <Form form={form} labelAlign="left">
      <Form.Item hidden name="id">
        <Input hidden />
      </Form.Item>
      <WrapperMainItem isView={isView}>
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
            {rightScreenItems}
          </RightScreen>
        </Row>
        {!isView && (
          <>
            <BankAccounts isView={isView} isEdit={isEdit} form={form} />
            <Divider />
            <IdCardInfo isView={isView} isEdit={isEdit} />
          </>
        )}
      </WrapperMainItem>
      <WrapperSubItem gutter={[64, 32]}>
        <Col span={isView ? 12 : 8}>
          <WrapperItem>
            <JobInfo form={form} isEdit={isEdit} isView={isView} />
          </WrapperItem>
        </Col>
        <Col span={isView ? 12 : 16}>
          <WrapperItem>
            <SocialNetwork isView={isView} />
          </WrapperItem>
        </Col>
      </WrapperSubItem>
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

const WrapperMainItem = styled.div<ScreenProps>`
  margin-top: ${props => (props.isView ? 'auto' : '2rem')};
  padding: 3em;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;

const WrapperSubItem = styled(Row)`
  padding-top: 2em;
`;

const WrapperItem = styled.div`
  padding: 3em 3em 1em 3em;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
`;
