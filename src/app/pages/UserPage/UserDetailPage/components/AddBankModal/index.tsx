/**
 *
 * AddBankModal
 *
 */
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { DialogModal } from 'app/components/DialogModal';
import { Form, FormInstance, Input, InputProps, Select } from 'antd';
import { UserDetailMessages } from '../../messages';
import { Button } from 'app/components/Button';

interface Props {
  isView?: boolean;
  form: FormInstance;
}
const { Option } = Select;

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

const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

export const AddBankModal = memo((props: Props) => {
  const { t } = useTranslation();
  const { isView, form } = props;
  const [bankForm] = Form.useForm();

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
        </>
      )}
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
            rules={[
              {
                required: true,
                message: t(UserDetailMessages.formEmptyBankName()),
              },
            ]}
          >
            <Select
              size="large"
              placeholder={t(UserDetailMessages.formBankNamePlaceholder())}
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
            rules={[
              {
                required: true,
                message: t(UserDetailMessages.formEmptyBankNumber()),
              },
            ]}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formBankNumberPlaceholder())
              }
            />
          </FormSearchItem>
          <FormSearchItem
            name={['bank_accounts', 0, 'branch']}
            label={t(UserDetailMessages.formBankBranchLabel())}
            rules={[
              {
                required: true,
                message: t(UserDetailMessages.formEmptyBankBranch()),
              },
            ]}
          >
            <Input
              {...(isView ? inputProps : {})}
              size="large"
              placeholder={
                isView ? '' : t(UserDetailMessages.formBankBranchPlaceholder())
              }
            />
          </FormSearchItem>
          <ModalButton>
            <Button htmlType="submit" type="primary" shape="round" size="large">
              {t(UserDetailMessages.formSubmitAddBankButton())}
            </Button>
          </ModalButton>
        </Form>
      </DialogModal>
    </>
  );
});

const FormSearchItem = styled(Form.Item)``;

const ModalButton = styled.div`
  text-align: center;
  button {
    padding: 0 2em !important;
  }
`;
