/**
 *
 * UserDetailPage
 *
 */
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Col, Form, Row } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import Button from 'app/components/Button';
import { config } from 'config';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { PrivatePath } from 'utils/url.const';
import { DetailForm } from '../EmployeeDetailPage/components/DetailForm/Loadable';
import { ProfileInfoDetail } from '../EmployeeDetailPage/components/ProfileInfo/components/ProfileInfoDetail';
import { UserDetailMessages } from '../EmployeeDetailPage/messages';
import { useUserDetailsSlice } from '../EmployeeDetailPage/slice';
import { useHandleEmployeeDetail } from '../EmployeeDetailPage/useHandleEmployeeDetail';

type Employee = models.hr.Employee;
interface EmployeeEditPageProps {
  employeeId: string;
}

const DATE_FORMAT = config.DATE_FORMAT;

export function EmployeeEditPage(props: EmployeeEditPageProps) {
  const { employeeId } = props;
  const [form] = Form.useForm();
  const { setBreadCrumb } = useBreadCrumbContext();
  const { user, getDetail, update, loading } = useHandleEmployeeDetail();
  const [data, setData] = React.useState<Employee>();
  const dispatch = useDispatch();
  const userDetailsSlice = useUserDetailsSlice();
  const history = useHistory();
  const { t } = useTranslation();

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
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
        dob: data.dob && moment(data.dob, DATE_FORMAT),
        starting_date:
          data.starting_date && moment(data.starting_date, DATE_FORMAT),
      });
      setBreadCrumb('Employees / ' + data.code);
    }
  }, [data, form, setBreadCrumb]);

  React.useEffect(() => {
    if (!employeeId) return;
    dispatch(userDetailsSlice.actions.fetchEmployeeSkills(employeeId));
  }, [dispatch, employeeId, userDetailsSlice.actions]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.dob) {
        values.dob = moment(values.dob).format(DATE_FORMAT);
      }
      if (values.starting_date) {
        values.starting_date = moment(values.starting_date).format(DATE_FORMAT);
      }

      delete values.email;
      const response = await update(values);
      if (response) {
        setData(response);
        history.push(`${PrivatePath.EMPLOYEES}/${employeeId}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        isEdit={true}
        isView={false}
        leftScreenItems={<></>}
        rightScreenItems={<ProfileInfoDetail isView={false} isEdit={true} />}
      />
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button
              block
              onClick={() => {
                history.push(`${PrivatePath.EMPLOYEES}/${employeeId}`);
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
              onClick={handleSubmit}
            >
              {t(UserDetailMessages.formSubmitButton())}
            </Button>
          </Col>
        </Row>
      </WrapperButton>
    </>
  );
}

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
