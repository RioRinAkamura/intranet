/**
 *
 * AvatarPath
 *
 */
import React, { memo, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  InputProps,
  Row,
  Upload,
} from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';
import { UserDetailMessages } from '../../messages';
import { CameraOutlined } from '@ant-design/icons';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { api } from 'utils/api';

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

export const AvatarPath = memo((props: Props) => {
  const { isView, form, user } = props;
  const { t } = useTranslation();

  const [imageURL, setImageURL] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

  const handleChange = async info => {
    setLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', info.file);
    const response = await api.uploadFile.uploadImage(formData);
    if (response) {
      setLoadingUpload(false);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (reader.result) {
          setImageURL(reader.result.toString());
        }
      });
      reader.readAsDataURL(info.file);

      form.setFieldsValue({ avatar: response.file_path });
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
                name={user?.first_name + ' ' + user?.last_name}
              />
            </FormItemAvatar>
            {!isView && (
              <WrapperUpload>
                <Upload
                  name="avatar"
                  listType="picture"
                  showUploadList={false}
                  beforeUpload={() => false}
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
  .ant-avatar {
    span {
      display: contents;
      svg {
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
  .ant-avatar-string {
    font-size: 44px;
  }
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
