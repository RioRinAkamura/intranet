import React, { useEffect } from 'react';
import { Modal, Button, Input, Form, Space } from 'antd';
import { useDeleteConfirmModal } from './useDeleteConfirmModal';

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
  const [form] = Form.useForm();
  const title = deleteModalState?.title;
  const description = deleteModalState?.description;
  const answer = deleteModalState?.answer;
  const defaultParam = {
    titleDefault: 'Delete',
    descriptionDefault: 'This will permanently delete and CANNOT be undone.',
    answerDefault: 'DO IT',
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
            { required: true, message: 'This field is required' },
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
            <Button type="primary" danger htmlType="submit">
              Delete
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
