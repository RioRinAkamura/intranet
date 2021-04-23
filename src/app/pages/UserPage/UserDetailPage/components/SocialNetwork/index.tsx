/**
 *
 * SocialNetwork
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Input, InputProps, Row } from 'antd';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { UserDetailMessages } from '../../messages';

interface SocialNetworkProps {
  isView?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const SocialNetwork = (props: SocialNetworkProps) => {
  const { isView } = props;
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formSocialNetworkTitle())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <FormItem
            name={['social', 'skype']}
            label={t(UserDetailMessages.formSocialsSkypeLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <SkypeFilled
                    style={{
                      color: '#00aff0',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsSkypePlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name={['social', 'twitter']}
            label={t(UserDetailMessages.formSocialsTwitterLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <TwitterCircleFilled
                    style={{
                      color: '#00acee',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsTwitterPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name={['social', 'facebook']}
            label={t(UserDetailMessages.formSocialsFacebookLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <FacebookFilled
                    style={{
                      color: '#1378f3',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsFacebookPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name={['social', 'linkedin']}
            label={t(UserDetailMessages.formSocialsLinkedinLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <LinkedinFilled
                    style={{
                      color: '#0e76a8',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsLinkedinPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name={['social', 'github']}
            label={t(UserDetailMessages.formSocialsGithubLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <GithubFilled
                    style={{
                      color: '#171515',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsGithubPlaceholder())
              }
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name={['social', 'gitlab']}
            label={t(UserDetailMessages.formSocialsGitlabLabel())}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              prefix={
                isView ? null : (
                  <GitlabFilled
                    style={{
                      color: '#fc6d26',
                      marginRight: 5,
                      fontSize: 'large',
                    }}
                  />
                )
              }
              placeholder={
                isView
                  ? ''
                  : t(UserDetailMessages.formSocialsGitlabPlaceholder())
              }
            />
          </FormItem>
        </Col>
      </Row>
    </>
  );
};

const FormItem = styled(Form.Item)`
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;
