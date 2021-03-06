import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DislikeTwoTone,
  LikeTwoTone,
  MinusCircleTwoTone,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  EmployeeNote,
  NoteCategory,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { SelectOption } from '@hdwebsoft/intranet-api-sdk/libs/type';
import {
  DatePicker,
  Form as FormAntd,
  FormInstance,
  Input,
  Row,
  Select,
} from 'antd';
import { RichEditor } from 'app/components/RichEditor';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import config from 'config';
import { TFunction } from 'i18next';
import moment from 'moment';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { api } from 'utils/api';
import { EmployeeNoteMessages } from '../messages';

interface FormProps {
  t: TFunction;
  form: FormInstance;
  note?: EmployeeNote;
  isView?: boolean;
  setVisible: (visible: boolean) => void;
  setCategoryId: (id: string) => void;
}

const { Option } = Select;

export const Form: React.FC<FormProps> = ({
  form,
  note,
  isView,
  t,
  setVisible,
  setCategoryId,
}) => {
  const [isCreateCategory, setIsCreateCategory] = React.useState<boolean>(
    false,
  );
  const { notify } = useNotify();
  const [categoryList, setCategoryList] = React.useState<NoteCategory[]>([]);
  const [scoreList, setScoreList] = React.useState<SelectOption[]>([]);

  const onCreateCategory = async () => {
    const name = form.getFieldValue('category_name');

    try {
      const category = await api.hr.employee.note.category.create({ name });

      setCategoryList([...categoryList, category]);
      form.resetFields(['category_name']);
      form.setFieldsValue({ category_id: category.id });
      setIsCreateCategory(false);
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        message: 'Create Failed',
        duration: 2,
      });
    }
  };

  React.useEffect(() => {
    if (note) {
      form.setFieldsValue({
        ...note,
        category_id: note.category?.id,
        date: moment(note.date),
      });
    }
  }, [form, note, isView]);

  const getCategories = async () => {
    const categories = await api.hr.employee.note.category.list();
    setCategoryList(categories.results);
  };

  const getEmployeeNoteScores = useCallback(async () => {
    const employeeNoteScores = await api.hr.employee.note.getEmployeeNoteScores();
    setScoreList(employeeNoteScores);
  }, []);

  React.useEffect(() => {
    getEmployeeNoteScores();
  }, [getEmployeeNoteScores]);

  const handleDeleteCategory = (id: string) => {
    setVisible(true);
    setCategoryId(id);
  };

  const handleCategoryChange = value => {
    setCategoryId(value);
  };

  React.useEffect(() => {
    if (!isView) getCategories();
  }, [isView]);

  const UI_DATE_FORMAT = 'MM-DD-YYYY';
  const DATE_FORMAT = config.DATE_FORMAT;
  const today = new Date();
  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };

  return (
    <FormAntd layout="vertical" form={form}>
      <FormAntd.Item
        name="score"
        label={t(EmployeeNoteMessages.modalScoreLabel())}
      >
        <Select size="large" defaultValue="2">
          {scoreList &&
            scoreList.map(score => (
              <Option key={score.value} value={score.value}>
                <Row justify="space-between" align="middle">
                  {score.label}
                  {score.label === 'Positive' ? (
                    <LikeTwoTone twoToneColor="green" />
                  ) : score.label === 'Neutral' ? (
                    <MinusCircleTwoTone twoToneColor="grey" />
                  ) : score.label === 'Negative' ? (
                    <DislikeTwoTone twoToneColor="red" />
                  ) : (
                    ''
                  )}
                </Row>
              </Option>
            ))}
        </Select>
      </FormAntd.Item>
      <StyledWrapperCategory>
        {isCreateCategory ? (
          <FormAntd.Item
            name="category_name"
            label={t(EmployeeNoteMessages.modalCategoryLabel())}
          >
            <Input
              size="large"
              placeholder={t(EmployeeNoteMessages.modalCategoryPlaceholder())}
              onPressEnter={onCreateCategory}
            />
          </FormAntd.Item>
        ) : (
          <FormAntd.Item
            name="category_id"
            label={t(EmployeeNoteMessages.modalCategoryLabel())}
          >
            <StyledSelect
              size="large"
              disabled={isView}
              allowClear={true}
              placeholder={t(
                EmployeeNoteMessages.modalCategorySelectPlaceholder(),
              )}
              onChange={value => handleCategoryChange(value)}
            >
              {categoryList.map(category => (
                <Option key={category.id} value={category.id}>
                  <div style={{ float: 'left' }}>{category.name}</div>
                  <StyledDeleteOutlined
                    onClick={() => handleDeleteCategory(category.id)}
                  />
                </Option>
              ))}
            </StyledSelect>
          </FormAntd.Item>
        )}

        {!isView &&
          (isCreateCategory ? (
            <>
              <StyledCheckCircleOutlined onClick={onCreateCategory} />
              <StyledCloseCircleOutlined
                onClick={() => setIsCreateCategory(false)}
              />
            </>
          ) : (
            <StyledPlusCircleOutlined
              onClick={() => setIsCreateCategory(true)}
            />
          ))}
      </StyledWrapperCategory>
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
        <StyledDatePicker
          size="large"
          disabled={isView}
          disabledDate={disabledDate}
          defaultValue={moment(today, DATE_FORMAT)}
          format={UI_DATE_FORMAT}
        />
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
  .ant-row.ant-form-item {
    width: 100%;
  }
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

const StyledSelect = styled(Select)`
  .ant-select-selection-item .anticon.anticon-delete {
    display: none;
  }
`;

const StyledDeleteOutlined = styled(DeleteOutlined)`
  float: right;
  margin-top: 5px;
  color: red;
`;
