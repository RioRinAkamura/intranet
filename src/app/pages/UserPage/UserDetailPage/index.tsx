/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useHistory, useLocation, useParams } from 'react-router';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { JobInfo } from './components/JobInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { SocialNetwork } from './components/SocialNetwork/Loadable';
import { UserDetailMessages } from './messages';
import { useGetUserDetail } from './useGetUserDetail';
import moment from 'moment';
import { useUpdateUserDetail } from './useUpdateUserDetail';

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
}

export function UserDetailPage(props: Props) {
  const { id } = useParams<Record<string, string | undefined>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();

  const { user } = useGetUserDetail(id);
  const { update, loading } = useUpdateUserDetail();

  const [imageURL, setImageURL] = React.useState('');
  const [loadingUpload, setLoadingUpload] = React.useState(false);
  const [isCreate, setIsCreate] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const dateFormat = 'YYYY-MM-DD';

  React.useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        id: user.id,
        dob: user.dob && moment(user.dob, dateFormat),
        issued_date: user.issued_date && moment(user.issued_date, dateFormat),
      });
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
    <div>
      {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {t(UserDetailMessages.formAvatarUpload())}
      </div>
    </div>
  );

  const isView = isCreate || isEdit ? false : true;

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.dob = moment(values.dob).format('YYYY-MM-DD');
        if (isEdit) {
          delete values.email;
          const response = await update(values);
          if (response) {
            setIsEdit(false);
          }
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <Wrapper>
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col md={isCreate ? 2 : 4} xs={12}>
            <Row gutter={[8, 8]}>
              <Col span={isCreate ? 24 : 12}>
                <Button
                  block
                  size="large"
                  shape="round"
                  onClick={() => history.push('/employees')}
                >
                  {t(UserDetailMessages.formBackButton())}
                </Button>
              </Col>
              {isCreate ? (
                <></>
              ) : isEdit ? (
                <Col span={12}>
                  <Button
                    block
                    size="large"
                    shape="round"
                    onClick={() => {
                      setIsEdit(false);
                    }}
                  >
                    {t(UserDetailMessages.formCancelButton())}
                  </Button>
                </Col>
              ) : (
                <Col span={12}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    shape="round"
                    loading={loading}
                    onClick={() => setIsEdit(true)}
                  >
                    {t(UserDetailMessages.formEditButton())}
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </WrapperButton>
      <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
        <Form.Item hidden name="id">
          <Input hidden />
        </Form.Item>
        <WrapperItem>
          <Row gutter={[32, 32]}>
            <LeftScreen md={10}>
              <Row gutter={[8, 8]} align="middle" justify="center">
                <Col span={24}>
                  <FormItemAvatar
                    name="avatar"
                    valuePropName="file"
                    rules={[
                      {
                        required: true,
                        message: t(UserDetailMessages.formEmptyAvatar()),
                      },
                    ]}
                  >
                    <WrapperImage style={{ textAlign: 'center' }}>
                      <Upload
                        name="avatar"
                        listType="picture"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        accept="image/png, image/jpeg, image/jpg"
                        disabled={!isCreate && !isEdit}
                      >
                        {imageURL || user?.avatar ? (
                          <Avatar
                            src={user?.avatar || imageURL}
                            alt="avatar"
                            size={100}
                          />
                        ) : (
                          uploadButton
                        )}
                      </Upload>
                    </WrapperImage>
                  </FormItemAvatar>
                </Col>
              </Row>
              <ProfileInfo isView={isView} isEdit={isEdit} />
            </LeftScreen>
            <RightScreen md={14}>
              <JobInfo isView={isView} />
              <SocialNetwork isView={isView} />
              <BankAccounts isView={isView} />
            </RightScreen>
          </Row>
        </WrapperItem>
      </Form>
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col md={2} xs={12}>
            {(isCreate || isEdit) && (
              <Button
                type="primary"
                block
                size="large"
                shape="round"
                loading={loading}
                onClick={() => {
                  handleSubmit();
                }}
              >
                {t(UserDetailMessages.formSubmitButton())}
              </Button>
            )}
          </Col>
        </Row>
      </WrapperButton>
    </Wrapper>
  );
}

const LeftScreen = styled(Col)`
  border-right: 8px solid #ececec;
`;

const RightScreen = styled(Col)`
  border-left: 2px solid #ececec;
`;

const FormItemAvatar = styled(Form.Item)`
  div {
    width: 100%;
    text-align: center;
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
  padding: 20px;
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

const WrapperImage = styled.div`
  margin-top: 1em;
  text-align: center;
`;
