/**
 *
 * SocialNetwork
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Input, InputProps, Row } from 'antd';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';
import Button from 'app/components/Button';
import { useHistory, useParams } from 'react-router-dom';
import { PrivatePath } from 'utils/url.const';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

interface SocialNetworkProps {
  // isView?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const SocialNetwork = (props: SocialNetworkProps) => {
  // const { isView } = props;
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const [isEdit, setIsEdit] = React.useState(false);
  const isView = !isEdit;
  const {
    update,
    loading,
  } = useHandleEmployeeDetail();
  const [form] = Form.useForm();
  const [data, setData] = React.useState<Employee>();

  const handleSocialAccountstEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        const response = await update(values);
        if (response) {
          setData(response);
          setIsEdit(false);
          history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <TitlePath>
        <b>{t(UserDetailMessages.formSocialNetworkTitle())}</b>
      </TitlePath>
      <Row gutter={[16, 12]}>
        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <SkypeFilled
                  style={{
                    color: '#00aff0',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsSkypeLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'skype']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <SkypeFilled
                        style={{
                          color: '#00aff0',
                          marginRight: 5,
                          fontSize: 'x-large',
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
          </Row>
        </Col>

        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <TwitterCircleFilled
                  style={{
                    color: '#00acee',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsTwitterLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'twitter']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <TwitterCircleFilled
                        style={{
                          color: '#00acee',
                          marginRight: 5,
                          fontSize: 'x-large',
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
          </Row>
        </Col>
        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <FacebookFilled
                  style={{
                    color: '#1378f3',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsFacebookLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'facebook']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <FacebookFilled
                        style={{
                          color: '#1378f3',
                          marginRight: 5,
                          fontSize: 'x-large',
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
          </Row>
        </Col>
        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <LinkedinFilled
                  style={{
                    color: '#0e76a8',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsLinkedinLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'linkedin']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <LinkedinFilled
                        style={{
                          color: '#0e76a8',
                          marginRight: 5,
                          fontSize: 'x-large',
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
          </Row>
        </Col>
        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <GithubFilled
                  style={{
                    color: '#171515',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsGithubLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'github']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <GithubFilled
                        style={{
                          color: '#171515',
                          marginRight: 5,
                          fontSize: 'x-large',
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
          </Row>
        </Col>
        <Col lg={isView ? 24 : 12} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            {isView ? (
              <Col md={2} xs={24}>
                <GitlabFilled
                  style={{
                    color: '#fc6d26',
                    marginRight: 5,
                    fontSize: 'x-large',
                  }}
                />
              </Col>
            ) : (
              <Col md={24} xs={24}>
                {t(UserDetailMessages.formSocialsGitlabLabel())}
              </Col>
            )}
            <Col lg={isView ? 20 : 24} xs={24}>
              <FormItem isView={isView} name={['social', 'gitlab']}>
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  prefix={
                    isView ? null : (
                      <GitlabFilled
                        style={{
                          color: '#fc6d26',
                          marginRight: 5,
                          fontSize: 'x-large',
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
        </Col>
      </Row>
      <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              <Button
                block
                onClick={() => {
                  if (isEdit) {
                    setIsEdit(false);
                    history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
                  } else if (isView) {
                    history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                {t(UserDetailMessages.formBackButton())}
              </Button>
            </Col>
            <Col>
              <Button
                loading={loading}
                block
                type="primary"
                onClick={() => {
                  if (isView) {
                    setIsEdit(true);
                    console.log('isView', isView);

                    history.push(
                      `${PrivatePath.EMPLOYEES}/${id}/social-accounts/edit`,
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleSocialAccountstEditSubmit();
                  }
                }}
              >
                {isView
                  ? t(UserDetailMessages.formEditButton())
                  : t(UserDetailMessages.formSubmitButton())}
              </Button>
            </Col>
          </Row>
        </WrapperButton>
    </>
  );
};

interface ScreenProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0' : '24px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
