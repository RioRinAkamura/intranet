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
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
const { TextArea } = Input;

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
  const { isView, form } = props;
  const { t } = useTranslation();
  const {
    positions,
    types,
    getPositions,
    getTypes,
  } = useHandleEmployeeDetail();

  React.useEffect(() => {
    getPositions();
    getTypes();
  }, [getPositions, getTypes]);

  return (
    <>
      <Row>
        <Col md={12} xs={24}>
          <Row gutter={[0, 12]} align="top">
            <Col md={isView ? 24 : 24} xs={24}>
              <TitlePath>
                <b>{t(UserDetailMessages.formJobTitle())}</b>
              </TitlePath>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {isView ? (
                <LabelWrapper>
                  {t(UserDetailMessages.formPositionLabel())}
                </LabelWrapper>
              ) : (
                t(UserDetailMessages.formPositionLabel())
              )}
            </Col>
            <Col md={isView ? 16 : 22} xs={24}>
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
                    {positions?.map(value => {
                      return (
                        <Option key={value.value} value={value.value}>
                          {value.label}
                        </Option>
                      );
                    })}
                  </StyledSelect>
                )}
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {isView ? (
                <LabelWrapper>
                  {t(UserDetailMessages.formJobTitleLabel())}
                </LabelWrapper>
              ) : (
                t(UserDetailMessages.formJobTitleLabel())
              )}
            </Col>
            <Col md={isView ? 16 : 22} xs={24}>
              <FormItem isView={isView} name="job_title">
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formJobTitlePlaceholder())
                  }
                />
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {isView ? (
                <LabelWrapper>
                  {t(UserDetailMessages.formTypeLabel())}
                </LabelWrapper>
              ) : (
                t(UserDetailMessages.formTypeLabel())
              )}
            </Col>
            <Col md={isView ? 16 : 22} xs={24}>
              <FormItem isView={isView} name="type">
                {isView ? (
                  <Input {...inputProps} size="large" />
                ) : (
                  <Select
                    defaultValue="Full-time"
                    size="large"
                    placeholder={t(UserDetailMessages.formTypePlaceholder())}
                  >
                    {types?.map(value => {
                      return (
                        <Option key={value.value} value={value.value}>
                          {value.label}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={isView ? 8 : 24} xs={24}>
              {isView ? (
                <LabelWrapper>
                  {t(UserDetailMessages.formJobTagsLabel())}
                </LabelWrapper>
              ) : (
                t(UserDetailMessages.formJobTagsLabel())
              )}
            </Col>
            <Col md={isView ? 16 : 22} xs={24}>
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
          </Row>
        </Col>
        <Col md={12} xs={24}>
          <Row gutter={[0, 12]} align="top">
            <Col md={isView ? 24 : 24} xs={24}>
              <TitlePath>
                <b>{t(UserDetailMessages.formJobDescription())}</b>
              </TitlePath>
            </Col>
            <Col md={isView ? 24 : 24} xs={24}>
              <FormItem isView={isView} name="job_description">
                <TextArea rows={8} disabled={isView} />
              </FormItem>
            </Col>
          </Row>
        </Col>
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
