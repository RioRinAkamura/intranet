/**
 *
 * JobInfo
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Col,
  Form,
  FormInstance,
  Input,
  InputProps,
  Row,
  Select,
  SelectProps,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { SelectValue } from 'antd/lib/select';
import { TitlePath } from '../TitlePath';
import { TagsInput } from 'app/components/Tags';
import { Skills } from 'app/components/Skills';
import { api } from 'utils/api';

const { Option } = Select;

interface JobInfoProps {
  employeeId?: string;
  isView?: boolean;
  isEdit?: boolean;
  form: FormInstance;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const selectProps: SelectProps<SelectValue> = {
  autoClearSearchValue: false,
  bordered: false,
  dropdownStyle: { display: 'none' },
  removeIcon: null,
};

export const JobInfo = (props: JobInfoProps) => {
  const { isView, form, isEdit, employeeId } = props;
  const { t } = useTranslation();
  const isShowSkill = isEdit || isView ? true : false;

  const getPositions = (): string[] => {
    return api.hr.employee.getEmployeePositions();
  };

  return (
    <>
      <TitlePath>
        <b>{t(UserDetailMessages.formJobTitle())}</b>
      </TitlePath>
      <Row gutter={[0, 12]} align="top">
        <Col md={isView ? 4 : 24} xs={24}>
          {isView ? (
            <LabelWrapper>
              {t(UserDetailMessages.formPositionLabel())}
            </LabelWrapper>
          ) : (
            t(UserDetailMessages.formPositionLabel())
          )}
        </Col>
        <Col md={isView ? 20 : 24} xs={24}>
          <FormItem isView={isView} name="position">
            {isView ? (
              <Input {...inputProps} size="large" />
            ) : (
              <StyledSelect
                {...(isView ? selectProps : {})}
                size="large"
                isView={isView}
                placeholder={
                  !isView && t(UserDetailMessages.formPositionPlaceholder())
                }
              >
                {getPositions()?.map(value => {
                  return <Option value={value}>{value}</Option>;
                })}
              </StyledSelect>
            )}
          </FormItem>
        </Col>
        <Col md={isView ? 4 : 24} xs={24}>
          {isView ? (
            <LabelWrapper>
              {t(UserDetailMessages.formJobTitleLabel())}
            </LabelWrapper>
          ) : (
            t(UserDetailMessages.formJobTitleLabel())
          )}
        </Col>
        <Col md={isView ? 20 : 24} xs={24}>
          <FormItem isView={isView} name="job_title">
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formJobTitlePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={isView ? 4 : 24} xs={24}>
          {isView ? (
            <LabelWrapper>{t(UserDetailMessages.formTypeLabel())}</LabelWrapper>
          ) : (
            t(UserDetailMessages.formTypeLabel())
          )}
        </Col>
        <Col md={isView ? 20 : 24} xs={24}>
          <FormItem isView={isView} name="type">
            {isView ? (
              <Input {...inputProps} size="large" />
            ) : (
              <Select
                defaultValue="Full-time"
                size="large"
                placeholder={t(UserDetailMessages.formTypePlaceholder())}
              >
                <Option value="Full-time">
                  {t(UserDetailMessages.formTypeFullTimeLabel())}
                </Option>
                <Option value="Part-time">
                  {t(UserDetailMessages.formTypePartTimeLabel())}
                </Option>
                <Option value="Probation">
                  {t(UserDetailMessages.formTypeProbationLabel())}
                </Option>
                <Option value="Etc">
                  {t(UserDetailMessages.formTypeEtcLabel())}
                </Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={isView ? 4 : 24} xs={24}>
          {isView ? (
            <LabelWrapper>
              {t(UserDetailMessages.formJobTagsLabel())}
            </LabelWrapper>
          ) : (
            t(UserDetailMessages.formJobTagsLabel())
          )}
        </Col>
        <Col md={isView ? 20 : 24} xs={24}>
          <FormItem isView={isView} name="tags">
            <TagsInput
              selectProps={selectProps}
              isView={isView}
              placeholder={
                isView ? '' : t(UserDetailMessages.formJobTagsPlaceholder())
              }
              callback={e => {
                form.setFieldsValue({ tags: e });
              }}
              className="selectTags"
            />
          </FormItem>
        </Col>
        {isShowSkill && (
          <Col md={24} xs={24}>
            <Skills employeeId={employeeId} isEdit={isEdit} />
          </Col>
        )}
      </Row>
    </>
  );
};
interface ScreenProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0' : '24px')};

  label {
    font-weight: 500;
  }
`;

const LabelWrapper = styled.div`
  margin: 7px 0;
  font-weight: 500;
`;

const StyledSelect = styled(Select)`
  .ant-select-selection-item {
    font-weight: ${({ isView }: ScreenProps) => (isView ? 500 : 400)};
  }
`;
