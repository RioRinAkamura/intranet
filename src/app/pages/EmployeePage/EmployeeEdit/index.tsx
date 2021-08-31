/**
 *
 * UserDetailPage
 *
 */
import * as React from 'react';
import styled from 'styled-components/macro';
import { Col, Form, Row } from 'antd';
import { useParams } from 'react-router';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import { config } from 'config';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { ProfileInfo } from '../EmployeeDetailPage/components/ProfileInfo/Loadable';
import { useGetUserDetail } from '../EmployeeDetailPage/useGetUserDetail';
import { DetailForm } from '../EmployeeDetailPage/components/DetailForm/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { useUserDetailsSlice } from '../EmployeeDetailPage/slice';

interface Props {}

type Employee = models.hr.Employee;

const DATE_FORMAT = config.DATE_FORMAT;

export function EmployeeEditPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const [form] = Form.useForm();
  const { setBreadCrumb } = useBreadCrumbContext();

  const { user } = useGetUserDetail(id);

  const [data, setData] = React.useState<Employee>();

  const dispatch = useDispatch();

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
    </>
  );
}

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
