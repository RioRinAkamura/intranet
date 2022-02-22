/**
 *
 * SocialNetwork
 *
 */
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { Col, Form, Row } from 'antd';
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
import { JobInfoDetail } from './components/JobInfoDetail';

interface JobInfoProps {
  employeeId: string;
}

export const JobInfo = (props: JobInfoProps) => {
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

  const handleContractEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (isEdit) {
        const response = await update(values);
        if (response) {
          setData(response);
          setIsEdit(false);
          history.push(`${PrivatePath.EMPLOYEES}/${id}/contract`);
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
          <JobInfoDetail isView={isView} isEdit={isEdit} form={form} />
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
                  history.push(`${PrivatePath.EMPLOYEES}/${id}/contract`);
                } else if (isView) {
                  history.push(`${PrivatePath.EMPLOYEES}/${id}/contract`);
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
                  history.push(`${PrivatePath.EMPLOYEES}/${id}/contract/edit`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  handleContractEditSubmit();
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
