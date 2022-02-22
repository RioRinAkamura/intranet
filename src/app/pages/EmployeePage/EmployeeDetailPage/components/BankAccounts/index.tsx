/**
 *
 * SocialNetwork
 *
 */
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Col, Form, Row } from 'antd';
import Button from 'app/components/Button';
import config from 'config';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PrivatePath } from 'utils/url.const';
import { LocationState } from '../..';
import { UserDetailMessages } from '../../messages';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { DetailForm } from '../DetailForm';
import { BankAccountsDetail } from './components/BankAccountsDetail';

interface BankAccountsProps {
  employeeId: string;
}

export const BankAccounts = (props: BankAccountsProps) => {
  const { employeeId } = props;
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [isEdit, setIsEdit] = React.useState(false);
  const isView = !isEdit;
  const [form] = Form.useForm();
  const [data, setData] = React.useState<Employee>();
  const { update, getDetail, user, loading } = useHandleEmployeeDetail();
  const DATE_FORMAT = config.DATE_FORMAT;

  React.useEffect(() => {
    if (employeeId) {
      getDetail(employeeId);
    }
  }, [employeeId, getDetail]);

  React.useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);

  React.useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
      });
    }
  }, [data, form]);

  const handleBankAccountEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.dob = moment(values.dob).format(DATE_FORMAT);
      if (values.issued_date) {
        values.issued_date = moment(values.issued_date).format(DATE_FORMAT);
      }
      if (isEdit) {
        const response = await update(values);
        if (response) {
          setData(response);
          setIsEdit(false);
          history.push(`${PrivatePath.EMPLOYEES}/${id}/bank-accounts`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <DetailForm
        form={form}
        data={data}
        isEdit={isEdit}
        isView={isView}
        leftScreenItems={<></>}
        rightScreenItems={
          <BankAccountsDetail isView={isView} isEdit={isEdit} />
        }
      />
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button
              block
              onClick={() => {
                if (isEdit) {
                  setIsEdit(false);
                  history.push(`${PrivatePath.EMPLOYEES}/${id}/bank-accounts`);
                } else if (isView) {
                  history.push(`${PrivatePath.EMPLOYEES}/${id}/bank-accounts`);
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
                  history.push(
                    `${PrivatePath.EMPLOYEES}/${id}/bank-accounts/edit`,
                  );
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  handleBankAccountEditSubmit();
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

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
