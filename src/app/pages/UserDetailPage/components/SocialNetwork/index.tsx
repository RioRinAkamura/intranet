/**
 *
 * SocialNetwork
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Divider, Form, Input, Row } from 'antd';
import { UsersMessages } from 'app/pages/UsersPage/messages';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';

interface Props {}

export const SocialNetwork = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  return (
    <>
      <Divider orientation="left">
        <b>{t(UsersMessages.modalFormSocialsLabel())}</b>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <FormItem
            name="skype"
            label={t(UsersMessages.modalFormSocialsSkypeLabel())}
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
              placeholder={t(UsersMessages.modalFormSocialsSkypePlaceholder())}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="twitter"
            label={t(UsersMessages.modalFormSocialsTwitterLabel())}
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
                UsersMessages.modalFormSocialsTwitterPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="FB"
            label={t(UsersMessages.modalFormSocialsFacebookLabel())}
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
                UsersMessages.modalFormSocialsFacebookPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="linkedin"
            label={t(UsersMessages.modalFormSocialsLinkedinLabel())}
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
                UsersMessages.modalFormSocialsLinkedinPlaceholder(),
              )}
            />
          </FormItem>
        </Col>
        <Col lg={12} xs={24}>
          <FormItem
            name="github"
            label={t(UsersMessages.modalFormSocialsGithubLabel())}
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
              placeholder={t(UsersMessages.modalFormSocialsGithubPlaceholder())}
            />
          </FormItem>
        </Col>
        <Col md={12} xs={24}>
          <FormItem
            name="gitlab"
            label={t(UsersMessages.modalFormSocialsGitlabLabel())}
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
              placeholder={t(UsersMessages.modalFormSocialsGitlabPlaceholder())}
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
