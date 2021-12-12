/**
 *
 * AvatarPath
 *
 */
import React, { memo, useEffect, useState } from 'react';
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
import { SyncOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { CameraOutlined } from '@ant-design/icons';
import { models } from '@hdwebsoft/intranet-api-sdk';

import { Avatar } from 'app/components/Avatar/Loadable';
import { api } from 'utils/api';

import { useUserDetailsSlice } from '../../slice';
import { selectUserDetails } from '../../slice/selectors';
import { UserDetailMessages } from '../../messages';

type Employee = models.hr.Employee;

interface Props {
  isView: boolean;
  isEdit: boolean;
  form: FormInstance;
  user?: Employee;
  hidden?: boolean;
}

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const AvatarPath = memo((props: Props) => {
  const { isView, form, user, isEdit, hidden } = props;

  const { t } = useTranslation();

  const [imageURL, setImageURL] = useState<string | undefined>('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const { actions } = useUserDetailsSlice();
  const dispatch = useDispatch();
  const userDetails = useSelector(selectUserDetails);

  const handleChange = async info => {
    setLoadingUpload(true);
    const formData = new FormData();
    formData.append('file', info.file);
    const response = await api.uploadFile.uploadImage(formData);
    if (response) {
      setLoadingUpload(false);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        console.log(reader, 'reader');
        if (reader.result) {
          console.log(reader.result.toString());
          setImageURL(reader.result.toString());
        }
      });
      reader.readAsDataURL(info.file);

      form.setFieldsValue({ avatar: response.file_path });
    }
  };

  useEffect(() => {
    if (isView || isEdit) return;

    dispatch(actions.fetchIdentity());
    setIsRefresh(false);
  }, [actions, dispatch, isRefresh, isView, isEdit]);

  useEffect(() => {
    if ((userDetails.identity && !isView && !isEdit) || isRefresh) {
      form.setFieldsValue({ code: userDetails.identity });
    }

    if (isEdit || isView) {
      setImageURL(user?.avatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isView, userDetails, isRefresh, isEdit, user?.avatar]);

  return (
    <>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <WrapperAvatar>
            <FormItemAvatar name="avatar" valuePropName="file">
              <Avatar
                src={imageURL}
                alt="avatar"
                icon={!isView && !user?.first_name && <CameraOutlined />}
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
        {!hidden && isView && (
          <Col span={12}>
            <b>{t(UserDetailMessages.formCodeLabel())}</b>
          </Col>
        )}
        {!hidden && (
          <StyledEmployeeCode span={isView ? 12 : 24}>
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
                disabled={user ? true : false}
                placeholder={
                  isView ? '' : t(UserDetailMessages.formCodePlaceholder())
                }
              />
            </FormItem>
            {!isView && !user && (
              <StyledButton
                type="primary"
                size="large"
                onClick={() => setIsRefresh(true)}
                icon={<SyncOutlined />}
              />
            )}
          </StyledEmployeeCode>
        )}
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
  width: ${(props: ScreenProps) => !props.isView && '100%'};
  input {
    color: ${(props: ScreenProps) => props.isView && '#1890ff'};
    font-weight: ${(props: ScreenProps) => props.isView && 500};
    text-align: center;
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

const StyledEmployeeCode = styled(Col)`
  display: flex;
  align-items: end;
`;

const StyledButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 20px;
  z-index: 1;
`;
