import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Input, Form } from 'antd';
import styled from 'styled-components/macro';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useDeviceCategorySlice } from './slice';
import { selectCategories } from './slice/selectors';
import { categoryResponse } from './slice/types';
import { DeleteModal } from 'app/components/DeleteModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { api } from 'utils/api';

interface CategoryProps {
  visible: boolean;
  onCancel: () => void;
}

export const DeviceCategory = (props: CategoryProps) => {
  const { visible, onCancel } = props;
  const { actions } = useDeviceCategorySlice();
  const dispatch = useDispatch();
  const [categoryForm] = Form.useForm();
  const [isModalVisible, setVisible] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const { notify } = useNotify();

  const categories = useSelector(selectCategories);

  const fetchCategories = useCallback(() => {
    dispatch(actions.fetchList({}));
  }, [dispatch, actions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleConfirmDelete = async () => {
    try {
      await api.hr.device.category.delete(categoryId);
      notify({
        type: ToastMessageType.Info,
        duration: 2,
        message: 'Delete category successful',
      });
      setVisible(false);
      fetchCategories();
    } catch (e) {
      console.log(e);
    }
  };

  const handleCancelDeleteModal = () => {
    setVisible(false);
  };

  const handleSubmitCategory = async e => {
    // trigger event when enter
    if (e.keyCode === 13) {
      categoryForm.validateFields().then(async values => {
        try {
          await api.hr.device.category.create({
            ...values,
            devices: [],
          });

          dispatch(actions.fetchList({}));
          categoryForm.resetFields();
        } catch (e) {
          console.log(e);
        }
      });
    }
  };

  const handleDeleteCategory = (category: categoryResponse) => {
    setVisible(true);
    setCategoryId(category.id);
  };
  return (
    <div>
      <DeleteModal
        open={isModalVisible}
        handleDelete={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        content="Are you sure you want to delete this information?"
      />

      <Modal
        title="Category Manager"
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button type="primary" shape="round" size="large" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <Form form={categoryForm}>
          <FormItem
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input
              size="large"
              placeholder="Please enter category name"
              onKeyDown={handleSubmitCategory}
            ></Input>
          </FormItem>
        </Form>
        <FlexWrapper>
          {categories?.map((category: categoryResponse) => {
            return (
              <ButtonIcon key={category.id}>
                {category.name}{' '}
                <CloseCircleOutlined
                  onClick={() => handleDeleteCategory(category)}
                />
              </ButtonIcon>
            );
          })}
        </FlexWrapper>
      </Modal>
    </div>
  );
};

const FormItem = styled(Form.Item)`
  align-items: center;

  label {
    font-weight: 500;
    min-width: 150px;
  }
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &.mt-10 {
    margin-top: 10px;
  }
`;

const ButtonIcon = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 0 5px 5px 0; */
  margin-right: 5px;
  margin-bottom: 5px;
`;
