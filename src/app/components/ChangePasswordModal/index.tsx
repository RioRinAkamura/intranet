import React, { useEffect } from 'react';
import { Modal, Form, Input, Space, Button } from 'antd';
import { messages } from './messages';
import { useTranslation } from 'react-i18next';

interface Props {
  isModalVisible: boolean;
  handleOk: (value) => void;
  handleCancel: () => void;
}

export const ChangePasswordModal = (props: Props) => {
  const { isModalVisible, handleOk, handleCancel } = props;
  const [form] = Form.useForm();
  const { t } = useTranslation();

  if (isModalVisible === true) {
    form.resetFields();
  }

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
      title="Change Password"
      centered
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[]}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="changePassword"
        onFinish={handleOk}
        scrollToFirstError
      >
        <Form.Item
          name="oldpassword"
          label="Old Password"
          rules={[
            {
              required: true,
              message: 'Please input old password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="newpassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please input new password!',
            },
            // {
            //   min: 8,
            //   message: '(*) Your password must be at least 8 characters!',
            // },

            // {
            //   pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~]).{8,64}$/,
            //   message:
            //     '(*) Password includes letters, digits, capital characters, special characters',
            // },

            ({ getFieldValue }) => ({
              validator(_, value) {
                let pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~]).{8,64}$/;
                if (!value || getFieldValue('newpassword').match(pattern)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    '(*) Password includes letters, digits, capital characters, special characters, at least 8 characters',
                  ),
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['newpassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newpassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!'),
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout} style={{ marginTop: '30px' }}>
          <Space>
            <Button onClick={handleCancel}>
              {t(messages.changePasswordCancel())}
            </Button>
            <Button type="primary" htmlType="submit">
              {t(messages.changePasswordTitle())}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
