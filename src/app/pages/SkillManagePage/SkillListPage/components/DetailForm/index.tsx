import React, { memo, useEffect, useState } from 'react';
import { Form, FormInstance, Input, Select, Spin, Typography } from 'antd';
import styled from 'styled-components';
import { Category } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { useSkillDetails } from 'app/pages/SkillManagePage/useSkillDetails';
import { useHistory } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';

const { Option } = Select;

interface Props {
  form: FormInstance;
}

const { Link } = Typography;

export const DetailForm = memo((props: Props) => {
  const { form } = props;
  // clone state to storage
  const history = useHistory();
  const { fetchAllCategory, categories, categoryLoading } = useSkillDetails();
  const [formCategories, setFormCategories] = useState(categories);

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  useEffect(() => {
    setFormCategories(categories);
  }, [categories]);

  const handleSearch = async (value: string) => {
    const newCategories = [...categories].filter((category: Category) =>
      category.name.toLowerCase().includes(value),
    );
    console.log(newCategories, 'new');
    setFormCategories([...newCategories]);
  };

  const options = formCategories?.map(category => (
    <Option key={category.id} value={category.id}>
      {category.name}
    </Option>
  ));
  console.log(categories, 'categories');
  return (
    <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
      {categoryLoading ? (
        <StyleSpin />
      ) : (
        <>
          <FormItem hidden name="id">
            <Input hidden />
          </FormItem>
          <FormItem
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input skill name',
              },
            ]}
            label="Skill name"
          >
            <Input placeholder="Skill name" size="large" />
          </FormItem>
          <FormItem name="category" label="category">
            <Select
              placeholder="Select Category"
              onSearch={handleSearch}
              showSearch
              filterOption={false}
            >
              {options}
              <Option value="">None</Option>
            </Select>
          </FormItem>
          <StyledLink
            onClick={() => history.push(PrivatePath.SKILLS_CATEGORIES)}
          >
            Manage Categories
          </StyledLink>
        </>
      )}
    </Form>
  );
});

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
    min-width: 150px;
  }
`;

const StyledLink = styled(Link)`
  margin-top: 10px;
`;

const StyleSpin = styled(Spin)`
  &.ant-spin.ant-spin-spinning {
    display: block;
    margin: 0 auto;
  }
`;
