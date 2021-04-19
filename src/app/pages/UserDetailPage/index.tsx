/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { UserDetailPageMessages } from './messages';
import { Avatar, Button, Col, Form, Input, message, Row, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { UsersMessages } from '../UsersPage/messages';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { RouteComponentProps, useLocation, useParams } from 'react-router';
import { ProfileInfo } from './components/ProfileInfo/Loadable';
import { JobInfo } from './components/JobInfo/Loadable';
import { BankAccounts } from './components/BankAccounts/Loadable';
import { SocialNetwork } from './components/SocialNetwork/Loadable';

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
      <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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
            <ProfileInfo />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col md={8}>
            <JobInfo />
          </Col>
          <Col md={8}>
            <BankAccounts />
          </Col>
          <Col md={8}>
            <SocialNetwork />
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
  background-color: #fff;
`;
