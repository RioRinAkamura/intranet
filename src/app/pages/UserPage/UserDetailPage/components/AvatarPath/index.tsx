/**
 *
 * AvatarPath
 *
 */
import React, { memo, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputProps,
  message,
  Row,
  Upload,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { CameraOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

type Employee = models.hr.Employee;

interface Props {
  isView: boolean;
  isEdit: boolean;
  form: FormInstance;
  user?: Employee;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

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

export const AvatarPath = memo((props: Props) => {
  const { isView, form, user } = props;
  const { t } = useTranslation();

  const [imageURL, setImageURL] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

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

  return (
    <>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <WrapperAvatar>
            <FormItemAvatar name="avatar" valuePropName="file">
              <Avatar
                src={user?.avatar || imageURL}
                alt="avatar"
                icon={!isView && <CameraOutlined />}
                size={170}
              />
            </FormItemAvatar>
            {!isView && (
              <WrapperUpload>
                <Upload
                  name="avatar"
                  listType="picture"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                  accept="image/png, image/jpeg, image/jpg"
                  disabled={isView}
                >
                  <Button loading={loadingUpload} block size="large">
                    {t(UserDetailMessages.formAvatarUpload())}
                  </Button>
                </Upload>
              </WrapperUpload>
            )}
          </WrapperAvatar>
        </Col>
        {isView && (
          <Col span={12}>
            <b>{t(UserDetailMessages.formCodeLabel())}</b>
          </Col>
        )}
        <Col span={isView ? 12 : 24}>
          <FormItem
            isView={isView}
            name="code"
            rules={
              isView
                ? []
                : [
                    {
                      required: true,
                      message: t(UserDetailMessages.formCodeEmpty()),
                    },
                  ]
            }
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formCodePlaceholder())
              }
            />
          </FormItem>
        </Col>
      </Row>
    </>
  );
});

interface ScreenProps {
  isView?: boolean;
}

const FormItemAvatar = styled(Form.Item)`
  div {
    text-align: center;
  }
  #avatar {
    background-color: white;
    span {
      display: contents;
      svg {
        font-size: 50px;
        color: gray;
        margin-bottom: 10px;
      }
    }
  }
`;

const FormItem = styled(Form.Item)`
  align-items: center;
  margin: 0;
  input {
    color: ${(props: ScreenProps) => props.isView && '#1890ff'};
    font-weight: ${(props: ScreenProps) => props.isView && 500};
  }
`;

const WrapperAvatar = styled.div`
  width: 100%;
  background-color: #f5f5f5;
  padding: 1em;
`;

const WrapperUpload = styled.div`
  text-align: center;
  margin: 0 1em 1em 1em;

  .ant-upload {
    width: 100%;

    button {
      color: #c5c4c5;
    }
  }
`;
