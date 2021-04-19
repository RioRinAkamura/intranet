/**
 *
 * SocialNetwork
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Input, Row } from 'antd';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { UserDetailMessages } from '../../messages';

interface Props {}

export const SocialNetwork = (props: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UserDetailMessages.formSocialNetworkTitle())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <FormItem
            name="skype"
            label={t(UserDetailMessages.formSocialsSkypeLabel())}
          >
            <Input
              size="large"
              prefix={
                <SkypeFilled
                  style={{
                    color: '#00aff0',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(UserDetailMessages.formSocialsSkypePlaceholder())}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="twitter"
            label={t(UserDetailMessages.formSocialsTwitterLabel())}
          >
            <Input
              size="large"
              prefix={
                <TwitterCircleFilled
                  style={{
                    color: '#00acee',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(
                UserDetailMessages.formSocialsTwitterPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="FB"
            label={t(UserDetailMessages.formSocialsFacebookLabel())}
          >
            <Input
              size="large"
              prefix={
                <FacebookFilled
                  style={{
                    color: '#1378f3',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(
                UserDetailMessages.formSocialsFacebookPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="linkedin"
            label={t(UserDetailMessages.formSocialsLinkedinLabel())}
          >
            <Input
              size="large"
              prefix={
                <LinkedinFilled
                  style={{
                    color: '#0e76a8',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(
                UserDetailMessages.formSocialsLinkedinPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="github"
            label={t(UserDetailMessages.formSocialsGithubLabel())}
          >
            <Input
              size="large"
              prefix={
                <GithubFilled
                  style={{
                    color: '#171515',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(UserDetailMessages.formSocialsGithubPlaceholder())}
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="gitlab"
            label={t(UserDetailMessages.formSocialsGitlabLabel())}
          >
            <Input
              size="large"
              prefix={
                <GitlabFilled
                  style={{
                    color: '#fc6d26',
                    marginRight: 5,
                    fontSize: 'large',
                  }}
                />
              }
              placeholder={t(UserDetailMessages.formSocialsGitlabPlaceholder())}
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
