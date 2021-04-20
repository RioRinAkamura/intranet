/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Upload,
} from 'antd';
import { CodeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useHistory, useLocation, useParams } from 'react-router';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { JobInfo } from './components/JobInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { SocialNetwork } from './components/SocialNetwork/Loadable';
import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import { UserProfile } from '../types';

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
  const { id } = useParams<Record<string, string | undefined>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { user } = useGetUserDetail(id);

  const [imageURL, setImageURL] = React.useState('');
  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [data, setData] = React.useState<UserProfile>();

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({ ...user });
      console.log(user);
      setData({ ...user });
    }
  }, [form, user]);

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
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  const uploadButton = (
    <div
      style={{
        width: '50%',
        margin: '0 25%',
        border: '1px dashed',
        padding: '5em',
      }}
    >
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {t(UserDetailMessages.formAvatarUpload())}
      </div>
    </div>
  );

  const editProps = isCreate
    ? {}
    : isEdit
    ? {}
    : { readOnly: true, bordered: false };

  const handleSubmit = () => {
    form
      .validateFields()
      .then(values => {
        console.log(values);
      })
      .catch(err => console.log(err));
  };

  return (
    <Wrapper>
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col md={2} xs={12}>
            {isCreate ? (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                onClick={handleSubmit}
              >
                Save
              </Button>
            ) : isEdit ? (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                onClick={() => {
                  setIsEdit(false);
                  handleSubmit();
                }}
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
      </WrapperButton>
      {isCreate || isEdit ? (
        <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          <WrapperItem>
            <Row gutter={[32, 32]}>
              <Col md={8} style={{ borderRight: '8px solid #ececec' }}>
                <Row gutter={[8, 8]} align="middle" justify="center">
                  <Col span={24}>
                    <FormItem
                      name="avatar"
                      valuePropName="file"
                      rules={[
                        {
                          required: true,
                          message: t(UserDetailMessages.formEmptyAvatar()),
                        },
                      ]}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <UploadImage
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
                        </UploadImage>
                      </div>
                    </FormItem>
                  </Col>
                  <Col>
                    <FormItem
                      name="code"
                      label={t(UserDetailMessages.formCodeLabel())}
                    >
                      <Input
                        {...editProps}
                        size="large"
                        placeholder={t(
                          UserDetailMessages.formCodePlaceholder(),
                        )}
                      />
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col md={16} style={{ borderLeft: '2px solid #ececec' }}>
                <ProfileInfo />
              </Col>
            </Row>
          </WrapperItem>
          <Divider />
          <Row gutter={[16, 16]}>
            <Col md={8}>
              <WrapperItem>
                <SocialNetwork />
              </WrapperItem>
            </Col>
            <Col md={8}>
              <WrapperItem>
                <JobInfo />
              </WrapperItem>
            </Col>
            <Col md={8}>
              <WrapperItem>
                <BankAccounts />
              </WrapperItem>
            </Col>
          </Row>
        </Form>
      ) : (
        data && (
          <>
            <WrapperItem>
              <Row gutter={[32, 32]}>
                <Col md={8} style={{ borderRight: '8px solid #ececec' }}>
                  <Row gutter={[32, 32]} align="middle" justify="center">
                    <Col span={24}>
                      <div style={{ textAlign: 'center' }}>
                        <Avatar src={data.avatar} alt="avatar" size={250} />
                      </div>
                    </Col>
                    <Col>
                      <div>
                        <span>
                          {data.first_name} {data.last_name}
                        </span>
                      </div>
                      <div>
                        <span>
                          <CodeOutlined style={{ fontSize: 'x-large' }} />{' '}
                          123123123
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col md={16} style={{ borderLeft: '2px solid #ececec' }}>
                  <ProfileInfo />
                </Col>
              </Row>
            </WrapperItem>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col md={8}>
                <WrapperItem>
                  <SocialNetwork />
                </WrapperItem>
              </Col>
              <Col md={8}>
                <WrapperItem>
                  <JobInfo />
                </WrapperItem>
              </Col>
              <Col md={8}>
                <WrapperItem>
                  <BankAccounts />
                </WrapperItem>
              </Col>
            </Row>
          </>
        )
      )}
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

const WrapperItem = styled.div`
  margin: 5px;
  padding: 10px;
  height: 100%;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.3);
`;

const WrapperButton = styled.div`
  margin: 5px;
  padding: 10px;
  height: 100%;
`;

const UploadImage = styled(Upload)`
  width: 250px;
  height: 250px;
  line-height: 250px;
  font-size: 18px;
`;
