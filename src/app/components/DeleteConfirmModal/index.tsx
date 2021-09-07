import React, { useEffect } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { RuleObject } from 'rc-field-form/lib/interface';
import { DeleteType } from 'utils/types';

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
  type?: DeleteType;
}

export const DeleteConfirmModal = (props: Props) => {
  const {
    handleCancel,
    handleOk,
    title,
    description,
    answer,
    visible,
    type = 'EMAIL',
  } = props;
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
    setDisabledButton(true);
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
        <Button key="back" shape="round" size="large" onClick={handleCancel}>
          {t(messages.deleteModalCancel())}
        </Button>,
        <Button
          key="submit"
          type="primary"
          danger
          form="deleteConfirmModal"
          htmlType="submit"
          shape="round"
          size="large"
          disabled={disabledButton}
        >
          {t(messages.deleteModalDelete())}
        </Button>,
      ]}
      onCancel={handleCancel}
    >
      {description || <p>{defaultParam.descriptionDefault}</p>}
      {type === DeleteType.EMAIL && <p>{t(messages.deleteModalTypeEmail())}</p>}
      {type === DeleteType.NAME && <p>{t(messages.deleteModalTypeName())}</p>}
      {type === DeleteType.MULTIPLE && (
        <p>
          {t(messages.deleteModalTypeCustom())}: <b>{answer}</b>
        </p>
      )}
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
