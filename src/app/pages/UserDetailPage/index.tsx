/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { UserDetailPageMessages } from './messages';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Upload,
} from 'antd';
import {
  FacebookFilled,
  GithubFilled,
  GitlabFilled,
  LinkedinFilled,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SkypeFilled,
  TwitterCircleFilled,
} from '@ant-design/icons';
import { UsersMessages } from '../UsersPage/messages';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { RouteComponentProps, useLocation, useParams } from 'react-router';

interface Props {}

const getBase64 = (img: Blob, callback: Function) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: File) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/jpg';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

interface LocationState {
  edit: boolean;
  from: {
    pathname: string;
  };
}

export function UserDetailPage(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = useParams<Record<string, string | undefined>>();
  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();

  const [imageURL, setImageURL] = React.useState('');
  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setLoadingUpload(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imageURL => {
        setImageURL(imageURL);
        setLoadingUpload(false);
        form.setFieldsValue({ avatar: imageURL });
      });
    }
  };

  React.useEffect(() => {
    if (id) {
      setIsCreate(false);
    } else {
      setIsCreate(true);
    }
  }, [id]);

  React.useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
      }
    }
  }, [location]);

  const uploadButton = (
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {t(UsersMessages.modalFormAvatarUpload())}
      </div>
    </div>
  );

  const editProps = isCreate
    ? {}
    : isEdit
    ? {}
    : { readOnly: true, bordered: false };

  return (
    <Wrapper>
      <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Row gutter={[8, 8]} justify="end">
          <Col md={2} xs={12}>
            {isCreate ? (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                onClick={() => {}}
              >
                Save
              </Button>
            ) : isEdit ? (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                onClick={() => setIsEdit(false)}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
            )}
          </Col>
        </Row>
        <Row gutter={[8, 8]}>
          <Col md={8}>
            <Row gutter={[8, 8]} align="middle" justify="center">
              <Col span={24}>
                <FormItem
                  // label={t(UsersMessages.modalFormAvatarLabel())}
                  name="avatar"
                  valuePropName="file"
                  rules={[
                    {
                      required: true,
                      message: t(UsersMessages.modalFormEmptyAvatar()),
                    },
                  ]}
                >
                  <div style={{ textAlign: 'center' }}>
                    <Upload
                      name="avatar"
                      listType="picture"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                      accept="image/png, image/jpeg, image/jpg"
                    >
                      {imageURL || form.getFieldValue('avatar') ? (
                        <Avatar
                          src={imageURL || form.getFieldValue('avatar')}
                          alt="avatar"
                          size={250}
                        />
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                  </div>
                </FormItem>
              </Col>
              <Col>
                <FormItem name="code" label="Code">
                  <Input {...editProps} size="large" />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={16}>
            <Row gutter={[16, 16]}>
              <Divider orientation="left">
                <b>{t(UsersMessages.modalInfomationTitle())}</b>
              </Divider>
              <Col md={6} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormFirstNameLabel())}
                  name="first_name"
                  rules={[
                    {
                      required: true,
                      message: t(UsersMessages.modalFormEmptyFirstName()),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={t(
                      UsersMessages.modalFormFirstNamePlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormLastNameLabel())}
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: t(UsersMessages.modalFormEmptyLastName()),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={t(
                      UsersMessages.modalFormLastNamePlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem
                  name="dob"
                  label={t(UsersMessages.modalFormDOBLabel())}
                >
                  <DatePicker
                    size="large"
                    placeholder={t(UsersMessages.modalFormDOBPlaceholder())}
                  />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem
                  name="gender"
                  label={t(UsersMessages.modalFormGenderLabel())}
                >
                  <Radio.Group>
                    <Radio value="Male">
                      {t(UsersMessages.modalFormGenderMaleLabel())}
                    </Radio>
                    <Radio value="Female">
                      {t(UsersMessages.modalFormGenderFemaleLabel())}
                    </Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormPhoneNumberLabel())}
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: t(UsersMessages.modalFormEmptyPhoneNumber()),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={t(
                      UsersMessages.modalFormPhoneNumberPlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
              <Col md={12} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormEmailLabel())}
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: t(UsersMessages.modalFormEmptyEmail()),
                    },
                    {
                      type: 'email',
                      message: t(UsersMessages.modalFormInvalidEmail()),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={t(UsersMessages.modalFormEmailPlaceholder())}
                  />
                  <Row gutter={[16, 16]}></Row>
                </FormItem>
              </Col>

              <Col md={6} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormStatusLabel())}
                  name="status"
                >
                  <Radio.Group defaultValue="Single">
                    <Radio value="Single">
                      {t(UsersMessages.modalFormStatusSingleLabel())}
                    </Radio>
                    <Radio value="Married">
                      {t(UsersMessages.modalFormStatusMarriedLabel())}
                    </Radio>
                  </Radio.Group>
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem name="id_number" label="Id Number">
                  <Input size="large" />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem name="issued_date" label="Issued Date">
                  <DatePicker size="large" />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem name="issued_place" label="Issued Place">
                  <Input size="large" />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <FormItem
                  name="social_insurance_no"
                  label="Social Insurance No"
                >
                  <Input size="large" />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col md={8}>
            <Divider orientation="left">
              <b>{t(UsersMessages.modalFormJobLabel())}</b>
            </Divider>
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormJobTitleLabel())}
                  name="job_title"
                >
                  <Input
                    size="large"
                    placeholder={t(
                      UsersMessages.modalFormJobTitlePlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
              <Col md={12} xs={24}>
                <FormItem
                  label={t(UsersMessages.modalFormTypeLabel())}
                  name="type"
                >
                  <Select defaultValue="Full-time" size="large">
                    <Select.Option value="Full-time">
                      {t(UsersMessages.modalFormTypeFullTimeLabel())}
                    </Select.Option>
                    <Select.Option value="Part-time">
                      {t(UsersMessages.modalFormTypePartTimeLabel())}
                    </Select.Option>
                    <Select.Option value="Probation">
                      {t(UsersMessages.modalFormTypeProbationLabel())}
                    </Select.Option>
                    <Select.Option value="Etc">
                      {t(UsersMessages.modalFormTypeEtcLabel())}
                    </Select.Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col md={8}>
            <Divider orientation="left">
              <b>Bank Accounts</b>
            </Divider>
            <WrapperBank>
              <Form.List name="bank_accounts">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <Row
                        gutter={[16, 16]}
                        key={key}
                        justify="center"
                        align="middle"
                      >
                        <Col md={11} xs={24}>
                          <Form.Item
                            {...restField}
                            label={`Bank name ${name + 1}`}
                            name={[name, 'bank_name']}
                            fieldKey={[fieldKey, 'bank_name']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing bank name',
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Input user's bank name"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={11} xs={24}>
                          <Form.Item
                            {...restField}
                            label={`Bank number ${name + 1}`}
                            name={[name, 'number']}
                            fieldKey={[fieldKey, 'number']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing number',
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Input user's bank number"
                            />
                          </Form.Item>
                        </Col>
                        <Col md={2} xs={24}>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Col>
                        <Col md={24} xs={24}>
                          <Form.Item
                            {...restField}
                            label={`Branch ${name + 1}`}
                            name={[name, 'branch']}
                            fieldKey={[fieldKey, 'branch']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing branch',
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              placeholder="Input user's bank branch"
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </WrapperBank>
          </Col>
          <Col md={8}>
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
                    placeholder={t(
                      UsersMessages.modalFormSocialsSkypePlaceholder(),
                    )}
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
                    placeholder={t(
                      UsersMessages.modalFormSocialsGithubPlaceholder(),
                    )}
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
                    placeholder={t(
                      UsersMessages.modalFormSocialsGitlabPlaceholder(),
                    )}
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Wrapper>
  );
}

const FormItem = styled(Form.Item)`
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;

const Wrapper = styled.div`
  padding: 1em;
`;

const WrapperBank = styled.div`
  height: 35vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 5px;
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
    margin-left: 5px;
  }

  ::-webkit-scrollbar {
    width: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #ececec;
    margin-left: 5px;
  }
`;
