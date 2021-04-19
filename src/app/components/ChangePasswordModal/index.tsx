import React, { useEffect } from 'react';
import { Modal, Form, Input, Space, Button, Spin, Divider } from 'antd';
import { messages } from './messages';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'types';
import { ToastMessageType, useNotify } from '../ToastNotification';
import styled from 'styled-components';

interface Props {
  isModalVisible: boolean | undefined;
  handleOk: (value) => void;
  handleCancel: () => void;
}

export const ChangePasswordModal = (props: Props) => {
  const { isModalVisible, handleOk, handleCancel } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const { notify } = useNotify();
  const changePasswordState = useSelector(
    (state: RootState) => state.changePassword,
  );

  if (isModalVisible === true) {
    form.resetFields();
  }

  useEffect(() => {
    if (changePasswordState?.changePasswordSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: `${t(messages.changePasswordSuccess())}`,
        className: 'label-cancel-user',
        duration: 2,
      });
    } else if (changePasswordState?.changePasswordFailed) {
      notify({
        type: ToastMessageType.Error,
        message: `${t(messages.changePasswordFailed())}`,
        description: `${t(messages.changePasswordWrongOld())}`,
        className: 'label-cancel-user',
        duration: 2,
      });
    }
  });

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 12,
        offset: 12,
      },
    },
  };

  return (
    <Modal
      title={t(messages.changePasswordTitle())}
      centered
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t(messages.changePasswordCancel())}
        </Button>,
        <Button form="changePasswordModal" type="primary" htmlType="submit">
          {t(messages.changePasswordTitle())}
        </Button>,
      ]}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="changePassword"
        onFinish={handleOk}
        scrollToFirstError
        id="changePasswordModal"
      >
        <Form.Item
          name="oldpassword"
          label={t(messages.changePasswordOld())}
          rules={[
            {
              required: true,
              message: `${t(messages.changePasswordInputOld())}`,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newpassword"
          label={t(messages.changePasswordNew())}
          rules={[
            {
              required: true,
              message: `${t(messages.changePasswordInputNew())}`,
            },
            {
              min: 8,
              message: '(*) Your password must be at least 8 characters!',
            },

            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~]).{8,64}$/,
              message:
                '(*) Password includes letters, digits, capital characters, special characters',
            },

            // ({ getFieldValue }) => ({
            //   validator(_, value) {
            //     let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~]).{8,64}$/;
            //     if (!value || getFieldValue('newpassword').match(pattern)) {
            //       return Promise.resolve();
            //     }
            //     return Promise.reject(
            //       new Error(t(messages.changePasswordComplexPassword())),
            //     );
            //   },
            // }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t(messages.changePasswordRetype())}
          dependencies={['newpassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: `${t(messages.changePasswordInputRetype())}`,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newpassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t(messages.changePasswordIsNotMatch())),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        {changePasswordState?.isLoading ? <SpinLoading></SpinLoading> : ''}
      </Form>
    </Modal>
  );
};

const SpinLoading = styled(Spin)`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgb(255 255 255 / 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
