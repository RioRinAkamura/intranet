/**
 *
 * JobInfo
 *
 */
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
import { SelectValue } from 'antd/lib/select';
import { RichEditor } from 'app/components/RichEditor';
import { TagsInput } from 'app/components/Tags';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { UserDetailMessages } from '../../messages';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { TitlePath } from '../TitlePath';

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
  const { id } = useParams<Record<string, string>>();
  const { isView, form } = props;
  const { t } = useTranslation();
  const [jobDesc, setJobDesc] = React.useState<any>();

  const {
    user,
    positions,
    types,
    getPositions,
    getTypes,
    getDetail,
  } = useHandleEmployeeDetail();

  React.useEffect(() => {
    getPositions();
    getTypes();
    getDetail(id);
  }, [getPositions, getTypes, getDetail, id]);

  React.useEffect(() => {
    if (user) {
      setJobDesc(user.job_description);
      form.setFieldsValue({
        ...user,
        job_description: user.job_description,
      });
    }
  }, [form, user]);

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
                {isView ? (
                  jobDesc && <RichEditor data={jobDesc} isView={isView} />
                ) : (
                  <RichEditor
                    width="100%"
                    height="340px"
                    data={jobDesc}
                    placeholder={isView ? '' : 'Descriptions'}
                    callback={value => {
                      form.setFieldsValue({ job_description: value });
                    }}
                  />
                )}
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
