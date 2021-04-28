/**
 *
 * AvatarPath
 *
 */
import React, { memo, useEffect, useState } from 'react';
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
  Select,
  Upload,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { CameraOutlined } from '@ant-design/icons';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { DialogModal } from 'app/components/DialogModal';
import { models } from '@hdwebsoft/boilerplate-api-sdk';

const { Option } = Select;
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

const bank = [
  {
    id: 1,
    name: 'Vietcombank',
  },
  {
    id: 2,
    name: 'Sacombank',
  },
  {
    id: 3,
    name: 'Techcombank',
  },
  {
    id: 4,
    name: 'ACB',
  },
  {
    id: 5,
    name: 'TPBank',
  },
];

export const AvatarPath = memo((props: Props) => {
  const { isView, form, user } = props;
  const { t } = useTranslation();
  const [bankForm] = Form.useForm();

  const [imageURL, setImageURL] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [modalAddBank, setModalAddBank] = useState(false);
  const [isAddBank, setIsAddBank] = useState(true);

  useEffect(() => {
    if (form.getFieldValue('bank_accounts')) {
      bankForm.setFieldsValue({
        bank_accounts: { ...form.getFieldValue('bank_accounts') },
      });
      setIsAddBank(false);
    }
  }, [bankForm, form]);

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

  const handleAddBank = values => {
    form.setFieldsValue({
      bank_accounts: [
        {
          bank_name: values.bank_accounts[0]['bank_name'],
          number: values.bank_accounts[0]['number'],
          branch: values.bank_accounts[0]['branch'],
        },
      ],
    });
    setIsAddBank(false);
    setModalAddBank(false);
  };

  return (
    <>
      <Row gutter={[32, 32]} align="middle">
        <Col span={24}>
          <WrapperAvatar>
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
              <Avatar
                src={user?.avatar || imageURL}
                alt="avatar"
                icon={isView && <CameraOutlined />}
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
        <Col span={24}>
          {!isView && (
            <>
              <Button
                type="primary"
                block
                size="large"
                onClick={() => setModalAddBank(true)}
              >
                {isAddBank
                  ? t(UserDetailMessages.formAddBankButton())
                  : t(UserDetailMessages.formEditBankButton())}
              </Button>
              <DialogModal
                title={
                  isAddBank
                    ? t(UserDetailMessages.formAddBankButton())
                    : t(UserDetailMessages.formEditBankButton())
                }
                isOpen={modalAddBank}
                handleCancel={() => {
                  setModalAddBank(false);
                  if (isAddBank) {
                    bankForm.resetFields();
                  }
                }}
              >
                <Form
                  form={bankForm}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  onFinish={handleAddBank}
                >
                  <FormSearchItem
                    name={['bank_accounts', 0, 'bank_name']}
                    label={t(UserDetailMessages.formBankNameLabel())}
                  >
                    <Select
                      size="large"
                      placeholder={t(
                        UserDetailMessages.formBankNamePlaceholder(),
                      )}
                    >
                      {bank &&
                        bank.map(item => {
                          return (
                            <Option key={item.id} value={item.name}>
                              {item.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </FormSearchItem>
                  <FormSearchItem
                    name={['bank_accounts', 0, 'number']}
                    label={t(UserDetailMessages.formBankNumberLabel())}
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={
                        isView
                          ? ''
                          : t(UserDetailMessages.formBankNumberPlaceholder())
                      }
                    />
                  </FormSearchItem>
                  <FormSearchItem
                    name={['bank_accounts', 0, 'branch']}
                    label={t(UserDetailMessages.formBankBranchLabel())}
                  >
                    <Input
                      {...(isView ? inputProps : {})}
                      size="large"
                      placeholder={
                        isView
                          ? ''
                          : t(UserDetailMessages.formBankBranchPlaceholder())
                      }
                    />
                  </FormSearchItem>
                  <ModalButton>
                    <Button
                      htmlType="submit"
                      type="primary"
                      shape="round"
                      size="large"
                    >
                      {t(UserDetailMessages.formSubmitAddBankButton())}
                    </Button>
                  </ModalButton>
                </Form>
              </DialogModal>
            </>
          )}
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

const FormSearchItem = styled(Form.Item)``;

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

const ModalButton = styled.div`
  text-align: center;
  button {
    padding: 0 2em !important;
  }
`;
