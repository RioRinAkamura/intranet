import React, { useEffect } from 'react';
import { Modal, Button, Input, Form, Space } from 'antd';
import { useDeleteConfirmModal } from './useDeleteConfirmModal';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { span: 16 },
};

interface IdDeleteEmployee {
  type: string | undefined;
  id: string | undefined;
}

interface Props {
  handleCancel: () => void;
  isDeleteModalVisible: boolean | undefined;
  idDelete?: IdDeleteEmployee;
}

export const DeleteConfirmModal = (props: Props) => {
  const { deleteModalState, deleteEmployee } = useDeleteConfirmModal();
  const { handleCancel, isDeleteModalVisible, idDelete } = props;
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const title = deleteModalState?.title;
  const description = deleteModalState?.description;
  const answer = deleteModalState?.answer;
  const loading = deleteModalState?.loading;
  const defaultParam = {
    titleDefault: `${t(messages.deleteModalTitle())}`,
    descriptionDefault: `${t(messages.deleteModalDesc())}`,
    answerDefault: `${t(messages.deleteModalAnswer())}`,
  };

  const onFinish = () => {
    if (idDelete) {
      const { type, id } = idDelete;
      if (type === 'deleteEmployee') {
        deleteEmployee(id);
      }
    }
  };

  useEffect(() => {
    form.resetFields();
  }, [form, isDeleteModalVisible]);

  return (
    <Modal
      visible={isDeleteModalVisible}
      title={title || defaultParam.titleDefault}
      footer={null}
      onCancel={handleCancel}
    >
      <p>
        <strong>{description || defaultParam.descriptionDefault}</strong>
      </p>
      <p>
        If you're sure, type{' '}
        <strong>{answer || defaultParam.answerDefault}</strong> in the box below
        to confirm
      </p>
      <Form
        {...layout}
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="confirmDelete"
          style={{ width: 300 }}
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
          <Input />
        </Form.Item>

        <Form.Item {...tailLayout} style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              {t(messages.deleteModalDelete())}
            </Button>
            <Button onClick={handleCancel}>
              {t(messages.deleteModalCancel())}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
