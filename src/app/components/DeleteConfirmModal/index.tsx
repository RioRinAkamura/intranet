import React, { useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface Props {
  visible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  title?: string;
  description?: string | JSX.Element;
  answer?: string;
}

export const DeleteConfirmModal = (props: Props) => {
  const { handleCancel, handleOk, title, description, answer, visible } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const defaultParam = {
    titleDefault: `${t(messages.deleteModalTitle())}`,
    descriptionDefault: `${t(messages.deleteModalDesc())}`,
    answerDefault: `${t(messages.deleteModalAnswer())}`,
  };

  useEffect(() => {
    form.resetFields();
  }, [form, visible]);

  return (
    <Modal
      visible={visible}
      title={title || defaultParam.titleDefault}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t(messages.deleteModalCancel())}
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          form="deleteConfirmModal"
          htmlType="submit"
        >
          {t(messages.deleteModalDelete())}
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      <p>{description || defaultParam.descriptionDefault}</p>
      <p>{t(messages.deleteModalTypeEmail())}</p>
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={handleOk}
        id="deleteConfirmModal"
      >
        <Form.Item
          name="confirmDelete"
          style={{ width: '100%', marginBottom: 0 }}
          rules={[
            {
              required: true,
              message: `${t(messages.deleteModalIsRequired())}`,
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  getFieldValue('confirmDelete') ===
                    (answer || defaultParam.answerDefault)
                ) {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <Input
            placeholder={answer || defaultParam.answerDefault}
            style={{ height: 40 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
