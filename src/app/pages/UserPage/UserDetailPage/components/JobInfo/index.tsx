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
  Divider,
  Form,
  Input,
  InputProps,
  Row,
  Select,
  SelectProps,
  Tag,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { SelectValue } from 'antd/lib/select';
import Link from 'antd/lib/typography/Link';
import { useGetUserTags } from '../../useGetUserTags';
import { TagType } from 'app/pages/UserPage/types';

const { Option } = Select;

interface JobInfoProps {
  isView?: boolean;
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
  const { isView } = props;
  const { t } = useTranslation();
  const { tags, loading } = useGetUserTags();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formJobTitle())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col md={12} xs={24}>
          <FormItem
            label={t(UserDetailMessages.formJobTitleLabel())}
            name="job_title"
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formJobTitlePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem label={t(UserDetailMessages.formTypeLabel())} name="type">
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
        <Col md={24} xs={24}>
          <FormItem
            name="tags"
            label={t(UserDetailMessages.formJobTagsLabel())}
          >
            <WrapperSelect
              {...(isView ? selectProps : {})}
              mode="tags"
              placeholder={
                isView ? '' : t(UserDetailMessages.formJobTagsPlaceholder())
              }
              size="large"
              maxTagCount="responsive"
              loading={loading}
              tagRender={props => (
                <TagOption color="blue" style={{ padding: '6px 12px' }}>
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
            </WrapperSelect>
          </FormItem>
        </Col>
      </Row>
    </>
  );
};

const WrapperSelect = styled(Select)`
  span {
    align-items: center;
  }
`;

const FormItem = styled(Form.Item)`
  label {
    font-weight: 500;
  }
`;

const TagOption = styled(Tag)`
  padding: 6px 12px;
  a {
    margin: 0px 2px 0px 5px !important;
    padding: 0 !important;
    color: black;
  }
`;
