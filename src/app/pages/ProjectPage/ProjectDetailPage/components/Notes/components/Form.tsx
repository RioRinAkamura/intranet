import React, { useCallback } from 'react';
import {
  Form as FormAntd,
  Select,
  Input,
  FormInstance,
  DatePicker,
  Row,
} from 'antd';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusCircleOutlined,
  LikeTwoTone,
  MinusCircleTwoTone,
  DislikeTwoTone,
} from '@ant-design/icons';
import { TFunction } from 'i18next';
import moment from 'moment';
import styled from 'styled-components';

import {
  ProjectNote,
  NoteCategory,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { RichEditor } from 'app/components/RichEditor';
import { api } from 'utils/api';

import { ProjectNoteMessages } from '../messages';
import { SelectOption } from '@hdwebsoft/intranet-api-sdk/libs/type';
import config from 'config';

interface FormProps {
  t: TFunction;
  form: FormInstance;
  note?: ProjectNote;
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
      const category = await api.hr.project.note.category.create({ name });

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
    const categories = await api.hr.project.note.category.list();
    setCategoryList(categories.results);
  };

  const getProjectNoteScores = useCallback(async () => {
    const employeeNoteScores = await api.hr.project.note.getProjectNoteScores();
    setScoreList(employeeNoteScores);
  }, []);

  React.useEffect(() => {
    getProjectNoteScores();
  }, [getProjectNoteScores]);

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
    <StyledFormAntd layout="vertical" form={form}>
      <StyledFormAntdSectionLeft>
        <FormAntd.Item
          name="summary"
          label={t(ProjectNoteMessages.modalSummaryLabel())}
        >
          <Input
            size="large"
            placeholder={t(ProjectNoteMessages.modalSummaryPlaceholder())}
            disabled={isView}
          />
        </FormAntd.Item>
        <StyledFormAntdItemContent
          name="content"
          label={t(ProjectNoteMessages.modalContentLabel())}
        >
          <RichEditor
            data={note?.content}
            width="100%"
            callback={value => {
              form.setFieldsValue({ content: value });
            }}
            isView={isView}
          />
        </StyledFormAntdItemContent>
      </StyledFormAntdSectionLeft>
      <StyledFormAntdSectionRight>
        <FormAntd.Item
          name="score"
          label={t(ProjectNoteMessages.modalScoreLabel())}
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
              label={t(ProjectNoteMessages.modalCategoryLabel())}
            >
              <Input
                size="large"
                placeholder={t(ProjectNoteMessages.modalCategoryPlaceholder())}
                onPressEnter={onCreateCategory}
              />
            </FormAntd.Item>
          ) : (
            <FormAntd.Item
              name="category_id"
              label={t(ProjectNoteMessages.modalCategoryLabel())}
            >
              <StyledSelect
                size="large"
                disabled={isView}
                placeholder={t(
                  ProjectNoteMessages.modalCategorySelectPlaceholder(),
                )}
                allowClear={true}
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
          name="date"
          label={t(ProjectNoteMessages.modalDateLabel())}
        >
          <StyledDatePicker
            size="large"
            disabled={isView}
            disabledDate={disabledDate}
            defaultValue={moment(today, DATE_FORMAT)}
            format={UI_DATE_FORMAT}
          />
        </FormAntd.Item>
      </StyledFormAntdSectionRight>
    </StyledFormAntd>
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
const StyledFormAntd = styled(FormAntd)`
  display: flex;
  flex-wrap: wrap;
`;

const StyledFormAntdSectionLeft = styled.div`
  padding-right: 10px;
  width: 50%;
  @media screen and (max-width: 756px) {
    width: 100%;
    padding-right: 0px;
    -webkit-order: 2;
    order: 2;
  }
`;
const StyledFormAntdSectionRight = styled.div`
  padding-left: 10px;
  width: 50%;
  @media screen and (max-width: 756px) {
    width: 100%;
    padding-left: 0px;
    -webkit-order: 1;
    order: 1;
  }
`;

const StyledFormAntdItemContent = styled(FormAntd.Item)`
  margin-bottom: 0px;

  @media screen and (max-width: 414px) {
    .editor {
      padding: 80px 16px 16px 16px;
    }
  }
`;
