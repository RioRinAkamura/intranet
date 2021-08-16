import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { messages } from './messages';
import { useTranslation } from 'react-i18next';
import { ToastMessageType, useNotify } from '../ToastNotification';
import { useChangePassword } from './useChangePassword';

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
  const { changePasswordState } = useChangePassword();
  const isLoading = changePasswordState?.isLoading;

  useEffect(() => {
    form.resetFields();
  }, [form, isModalVisible]);

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

  return (
    <Modal
      title={t(messages.changePasswordTitle())}
      centered
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="back" shape="round" size="large" onClick={handleCancel}>
          {t(messages.changePasswordCancel())}
        </Button>,
        <Button
          loading={isLoading}
          form="changePasswordModal"
          type="primary"
          htmlType="submit"
          shape="round"
          size="large"
        >
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
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?\\@[\]^_`{|}~]).{8,64}$/,
              message:
                '(*) Password includes letters, digits, capital characters, special characters',
            },
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
      </Form>
    </Modal>
  );
};
