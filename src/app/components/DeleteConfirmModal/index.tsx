import React, { useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { RuleObject } from 'rc-field-form/lib/interface';

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
  const [disabledButton, setDisabledButton] = React.useState(true);
  const defaultParam = {
    titleDefault: `${t(messages.deleteModalTitle())}`,
    descriptionDefault: `${t(messages.deleteModalDesc())}`,
    answerDefault: `${t(messages.deleteModalAnswer())}`,
  };

  useEffect(() => {
    form.resetFields();
  }, [form, visible]);

  const validateAnswer = (
    rule: RuleObject,
    value: string,
    callback: (message?: string) => void,
  ) => {
    if (value === (answer || defaultParam.answerDefault)) {
      setDisabledButton(false);
      callback();
    } else {
      setDisabledButton(true);
      callback();
    }
  };

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
          disabled={disabledButton}
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
        wrapperCol={{ span: 24 }}
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
            {
              validator: validateAnswer,
            },
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
