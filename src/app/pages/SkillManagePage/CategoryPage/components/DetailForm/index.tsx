import React, { memo, useEffect } from 'react';
import { Form, FormInstance, Input } from 'antd';
import styled from 'styled-components';
import { Category } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { useSkillDetails } from 'app/pages/SkillManagePage/useSkillDetails';

interface Props {
  form: FormInstance;
  category?: Category;
}

export const DetailForm = memo((props: Props) => {
  const { form, category } = props;

  // state
  // func
  // hooks
  const { fetchSingleCategory } = useSkillDetails();

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        id: category.id,
        name: category.name,
      });
    }
  }, [form, category, fetchSingleCategory]);

  return (
    <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
      <FormItem hidden name="id">
        <Input hidden />
      </FormItem>
      <FormItem
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input category name',
          },
        ]}
        label="Category name"
      >
        <Input placeholder="Category name" size="large" />
      </FormItem>
    </Form>
  );
});

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
    min-width: 150px;
  }
`;
