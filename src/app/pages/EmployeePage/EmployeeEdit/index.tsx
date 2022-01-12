/**
 *
 * UserDetailPage
 *
 */
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Form } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { config } from 'config';
import moment from 'moment';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { DetailForm } from '../EmployeeDetailPage/components/DetailForm/Loadable';
import { ProfileInfo } from '../EmployeeDetailPage/components/ProfileInfo/Loadable';
import { useUserDetailsSlice } from '../EmployeeDetailPage/slice';
import { useHandleEmployeeDetail } from '../EmployeeDetailPage/useHandleEmployeeDetail';

interface Props {}

type Employee = models.hr.Employee;

const DATE_FORMAT = config.DATE_FORMAT;

export function EmployeeEditPage(props: Props) {
  const { id } = useParams<Record<string, string>>();
  const [form] = Form.useForm();
  const { setBreadCrumb } = useBreadCrumbContext();

  const { user, getDetail } = useHandleEmployeeDetail();

  const [data, setData] = React.useState<Employee>();

  const dispatch = useDispatch();

  const userDetailsSlice = useUserDetailsSlice();

  React.useEffect(() => {
    if (id) {
      getDetail(id);
    }
  }, [id, getDetail]);

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
    <DetailForm
      form={form}
      data={data}
      isEdit={true}
      isView={false}
      leftScreenItems={<></>}
      rightScreenItems={<ProfileInfo isView={false} isEdit={true} />}
    />
  );
}
