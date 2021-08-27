import React from 'react';
import {
  Form as FormAntd,
  Select,
  Input,
  FormInstance,
  DatePicker,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { TFunction } from 'i18next';
import moment from 'moment';
import styled from 'styled-components';
import { NoteCategory } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

import { RichEditor } from 'app/components/RichEditor';
import { api } from 'utils/api';

import { EmployeeNote } from '../slice/types';
import { EmployeeNoteMessages } from '../messages';

interface FormProps {
  t: TFunction;
  form: FormInstance;
  note?: EmployeeNote;
  isView?: boolean;
}

const { Option } = Select;

export const Form: React.FC<FormProps> = ({ form, note, isView, t }) => {
  const [isCreateCategory, setIsCreateCategory] = React.useState<boolean>(
    false,
  );
  const [categoryList, setCategoryList] = React.useState<NoteCategory[]>([]);
  const [category, setCategory] = React.useState<string>();

  const onCreateCategory = async () => {
    const name = form.getFieldValue('category');

    const category = await api.hr.employee.note.category.create({ name });

    setCategoryList([...categoryList, category]);
    setCategory(category.id);
    setIsCreateCategory(false);
  };

  React.useEffect(() => {
    if (note) {
      form.setFieldsValue({
        ...note,
        date: moment(note.date),
      });
    }
  }, [form, note, isView]);

  const getCategories = async () => {
    const categories = await api.hr.employee.note.category.list();
    setCategoryList(categories.results);
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <FormAntd layout="vertical" form={form}>
      <FormAntd.Item
        name="category"
        label={t(EmployeeNoteMessages.modalCategoryLabel())}
      >
        <StyledWrapperCategory>
          {isCreateCategory ? (
            <>
              <Input
                size="large"
                placeholder={t(EmployeeNoteMessages.modalCategoryPlaceholder())}
              />
              <StyledCheckCircleOutlined onClick={onCreateCategory} />
              <StyledCloseCircleOutlined
                onClick={() => setIsCreateCategory(false)}
              />
            </>
          ) : (
            <Select
              size="large"
              disabled={isView}
              value={category}
              onChange={(value: string) => setCategory(value)}
              placeholder={t(
                EmployeeNoteMessages.modalCategorySelectPlaceholder(),
              )}
            >
              {categoryList.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          )}
          <StyledPlusCircleOutlined onClick={() => setIsCreateCategory(true)} />
        </StyledWrapperCategory>
      </FormAntd.Item>
      <FormAntd.Item
        name="summary"
        label={t(EmployeeNoteMessages.modalSummaryLabel())}
      >
        <Input
          size="large"
          placeholder={t(EmployeeNoteMessages.modalSummaryPlaceholder())}
          disabled={isView}
        />
      </FormAntd.Item>
      <FormAntd.Item
        name="date"
        label={t(EmployeeNoteMessages.modalDateLabel())}
      >
        <StyledDatePicker size="large" disabled={isView} />
      </FormAntd.Item>
      <FormAntd.Item
        name="content"
        label={t(EmployeeNoteMessages.modalContentLabel())}
      >
        <RichEditor
          data={note?.content}
          width="100%"
          callback={value => {
            form.setFieldsValue({ content: value });
          }}
          isView={isView}
        />
      </FormAntd.Item>
    </FormAntd>
  );
};

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;

const StyledWrapperCategory = styled.div`
  display: flex;
  align-items: center;
`;

const StyledPlusCircleOutlined = styled(PlusCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.5rem;
  color: blue;
`;

const StyledCheckCircleOutlined = styled(CheckCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  margin: 0 0.5rem;
  color: green;
`;

const StyledCloseCircleOutlined = styled(CloseCircleOutlined)`
  cursor: pointer;
  font-size: 1rem;
  color: red;
`;
