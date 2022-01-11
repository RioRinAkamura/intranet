import React, { memo, useEffect, useState } from 'react';
import {
  Form,
  FormInstance,
  Input,
  message,
  Select,
  Spin,
  Typography,
} from 'antd';
import styled from 'styled-components';
import {
  Category,
  Skill,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { useSkillDetails } from 'app/pages/SkillManagePage/useSkillDetails';
import { useHistory } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';

const FormSearchItem = Form.Item;
const { Option } = Select;

interface Props {
  form: FormInstance;
  skill?: Skill;
}

const { Link } = Typography;

export const DetailForm = memo((props: Props) => {
  const { form, skill } = props;
  const history = useHistory();
  // state
  const [categories, setCategories] = useState<Category[] | undefined>([]);
  const [searchLoad, setSearchLoad] = useState(false);

  // func
  const { fetchCategory, fetchSingleCategory } = useSkillDetails();
  // hooks

  const handleSearch = async (value: string) => {
    try {
      setSearchLoad(true);
      const response = await fetchCategory(value);
      if (response) {
        setCategories(response);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSearchLoad(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (skill) {
          if (skill.category) {
            const response = await fetchSingleCategory(skill.category);
            if (response) {
              form.setFieldsValue({
                id: skill.id,
                name: skill.name,
                category: response.name,
              });
            }
          } else {
            form.setFieldsValue({
              id: skill.id,
              name: skill.name,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [form, skill, fetchSingleCategory]);

  const options = categories?.map(category => (
    <Option key={category.id} value={category.id}>
      {category.name}
    </Option>
  ));

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
            message: 'Please input skill name',
          },
        ]}
        label="Skill name"
      >
        <Input placeholder="Skill name" size="large" />
      </FormItem>
      <FormSearchItem name="category" label="Category" initialValue={null}>
        <Select
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          size="large"
          loading={searchLoad}
          placeholder="Category"
          onSearch={handleSearch}
          onFocus={() => handleSearch(' ')}
          notFoundContent={searchLoad ? <Spin size="default" /> : null}
        >
          {options}
          <Option key="None" value="">
            None
          </Option>
        </Select>

        <Link onClick={() => history.push(PrivatePath.SKILLS_CATEGORIES)}>
          Manage Categories
        </Link>
      </FormSearchItem>
    </Form>
  );
});

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
    min-width: 150px;
  }
`;
