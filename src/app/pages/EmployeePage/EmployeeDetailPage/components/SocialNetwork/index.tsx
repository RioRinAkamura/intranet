/**
 *
 * SocialNetwork
 *
 */
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Col, Form, Row } from 'antd';
import { useAuthState } from 'app/components/Auth/useAuthState';
import Button from 'app/components/Button';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components/macro';
import { PrivatePath } from 'utils/url.const';
import { LocationState } from '../..';
import { UserDetailMessages } from '../../messages';
import { useHandleEmployeeDetail } from '../../useHandleEmployeeDetail';
import { DetailForm } from '../DetailForm';
import { SocialNetworkDetail } from './components/SocialNetworkDetail';

interface SocialNetworkProps {
  employeeId: string;
}

export const SocialNetwork = (props: SocialNetworkProps) => {
  const { employeeId } = props;
  const [isStaff, setIsStaff] = React.useState<boolean>(false);
  const { identity } = useAuthState();
  React.useEffect(() => {
    if (identity && identity?.role?.length === 0) return;
    if (identity && identity?.role && identity?.role[0].name === 'staff') {
      setIsStaff(true);
    } else {
      setIsStaff(false);
    }
  }, [identity]);
  const { t } = useTranslation();
  const { id } = useParams<Record<string, string>>();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [isEdit, setIsEdit] = React.useState(false);
  const isView = !isEdit;
  const [form] = Form.useForm();
  const [data, setData] = React.useState<Employee>();
  const { update, getDetail, user, loading } = useHandleEmployeeDetail();

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

  const handleSocialAccountstEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        const response = await update(values);
        if (response) {
          setData(response);
          setIsEdit(false);
          history.push(`${PrivatePath.EMPLOYEES}/${id}/social-accounts`);
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
          <SocialNetworkDetail isView={isView} isEdit={isEdit} />
        }
      />
      {!isStaff && (
        <WrapperButton>
          <Row gutter={[8, 8]} justify="end">
            <Col>
              {isEdit && (
                <Button
                  block
                  onClick={() => {
                    if (isEdit) {
                      setIsEdit(false);
                      history.push(
                        `${PrivatePath.EMPLOYEES}/${id}/social-accounts`,
                      );
                    } else if (isView) {
                      history.push(
                        `${PrivatePath.EMPLOYEES}/${id}/social-accounts`,
                      );
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t(UserDetailMessages.formBackButton())}
                </Button>
              )}
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
                      `${PrivatePath.EMPLOYEES}/${id}/social-accounts/edit`,
                    );
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    handleSocialAccountstEditSubmit();
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
      )}
    </>
  );
};

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
