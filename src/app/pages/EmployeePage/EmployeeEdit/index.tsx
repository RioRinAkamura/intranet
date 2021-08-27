/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row } from 'antd';
import { useHistory, useParams } from 'react-router';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { config } from 'config';
import Button from 'app/components/Button';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { ProfileInfo } from '../EmployeeDetailPage/components/ProfileInfo/Loadable';
import { UserDetailMessages } from '../EmployeeDetailPage/messages';
import { useGetUserDetail } from '../EmployeeDetailPage/useGetUserDetail';
import { useUpdateUserDetail } from '../EmployeeDetailPage/useUpdateUserDetail';
import { DetailForm } from '../EmployeeDetailPage/components/DetailForm/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { useUserDetailsSlice } from '../EmployeeDetailPage/slice';
import { PrivatePath } from 'utils/url.const';

interface Props {}

type Employee = models.hr.Employee;

const DATE_FORMAT = config.DATE_FORMAT;

export function EmployeeEditPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { setBreadCrumb } = useBreadCrumbContext();

  const { user } = useGetUserDetail(id);
  const { update, loading } = useUpdateUserDetail();

  const [data, setData] = React.useState<Employee>();

  const dispatch = useDispatch();
  const history = useHistory();

  const userDetailsSlice = useUserDetailsSlice();

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
        issued_date: data.issued_date && moment(data.issued_date, DATE_FORMAT),
      });
      setBreadCrumb('Employees / ' + data.code);
    }
  }, [data, form, setBreadCrumb]);

  React.useEffect(() => {
    if (!id) return;

    dispatch(userDetailsSlice.actions.fetchEmployeeSkills(id));
  }, [dispatch, id, userDetailsSlice.actions]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.dob = moment(values.dob).format(DATE_FORMAT);
        if (values.issued_date) {
          values.issued_date = moment(values.issued_date).format(DATE_FORMAT);
        }
        delete values.email;
        const response = await update(values);
        if (response) {
          setData(response);
          history.push(`${PrivatePath.EMPLOYEES}/${id}`);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <Wrapper>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col sm={16} xs={24}>
            <PageTitle>Edit Employee</PageTitle>
          </Col>
          <Col sm={8} xs={24}></Col>
        </Row>
      </Wrapper>
      <DetailForm
        form={form}
        data={data}
        isEdit={true}
        isView={false}
        leftScreenItems={<></>}
        rightScreenItems={<ProfileInfo isView={false} isEdit={true} />}
      />
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button
              loading={loading}
              block
              type="primary"
              onClick={() => {
                handleSubmit();
              }}
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

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
`;

const PageTitle = styled.p`
  font-size: 25px;
  line-height: 30px;
  color: rgb(112 112 112);
  padding: 0;
  margin: 0;
`;
