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

const { Option } = Select;

interface JobInfoProps {
  isView?: boolean;
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

  return (
    <>
      <TitlePath>
        <b>{t(UserDetailMessages.formJobTitle())}</b>
      </TitlePath>
      <Row gutter={[0, 12]} align="top">
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
              <Select defaultValue="Full-time" size="large">
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
          {t(UserDetailMessages.formJobTagsLabel())}
        </Col>
        <Col md={isView ? 20 : 24} xs={24}>
          <FormItem isView={isView} name="tags">
            {/* <WrapperSelect
              {...(isView ? selectProps : {})}
              isView={isView}
              mode="tags"
              placeholder={
                isView ? '' : t(UserDetailMessages.formJobTagsPlaceholder())
              }
              size="large"
              loading={loading}
              className="selectTags"
              tagRender={props => (
                <TagOption color="blue">
                  {props.label}
                  {!isView && <Link onClick={() => props.onClose()}>x</Link>}
                </TagOption>
              )}
            >
              {tags &&
                tags.map((tag: TagType) => (
                  <Option key={tag.id} value={tag.slug}>
                    {tag.name}
                  </Option>
                ))}
            </WrapperSelect> */}
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

  input {
    font-weight: ${(props: ScreenProps) => props.isView && 500};
  }
`;

const LabelWrapper = styled.div`
  margin: 7px 0;
`;
