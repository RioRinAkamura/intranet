/**
 *
 * LeaveApplicationDetailPage
 *
 */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
} from 'antd';
import { SelectValue } from 'antd/lib/select';
import { useHistory, useLocation, useParams } from 'react-router';
import moment from 'moment';
import { useLeaveApplicationDetail } from './useLeaveApplicationDetail';
import PageTitle from 'app/components/PageTitle';
import { config } from 'config';
import {
  inputViewProps,
  datePickerViewProps,
  textareaViewProps,
} from 'utils/types';
import { FORM_RULES, WORKING_TYPE } from 'constants/leave_application';
import { calcBusinessDays } from 'utils/variable';
import { useGetIdentity } from 'app/components/Auth/useGetIdentity';
import { CardLayout } from 'app/components/CardLayout';

interface Props {}
interface LocationState {
  edit: boolean;
}

const { Option } = Select;

const selectProps: SelectProps<SelectValue> = {
  autoClearSearchValue: false,
  bordered: false,
  dropdownStyle: { display: 'none' },
  removeIcon: null,
  showArrow: false,
  style: { pointerEvents: 'none' },
};

const DATE_FORMAT = config.DATE_FORMAT;

export const LeaveApplicationDetailPage = (props: Props) => {
  const { id } = useParams<Record<string, string>>();
  const [form] = Form.useForm();
  const location = useLocation<LocationState>();
  const history = useHistory();
  const {
    fetchEmployees,
    detail,
    create,
    update,
    approve,
    reject,
    loading,
  } = useLeaveApplicationDetail();

  const [employees, setEmployees] = useState<any>();
  const [data, setData] = useState<any>();
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const { identity } = useGetIdentity();

  const isView = isCreate || isEdit ? false : true;

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        working_type: 'Off',
        start_date: data.start_date && moment(data.start_date),
        end_date: data.end_date && moment(data.end_date),
      });
    }
  }, [data, form, isEdit]);

  useEffect(() => {
    const start_date = data?.start_date && new Date(data.start_date);
    const end_date = data?.end_date && new Date(data.end_date);

    if (start_date && end_date && start_date <= end_date) {
      form.setFieldsValue({
        total_hours: calcBusinessDays(start_date, end_date) * 8,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (id) {
      setIsCreate(false);
      (async () => {
        setData(await detail(id));
      })();
    } else {
      setIsCreate(true);
    }
  }, [id, detail]);

  useEffect(() => {
    (async () => {
      setEmployees(await fetchEmployees());
    })();
  }, [fetchEmployees]);

  useEffect(() => {
    if (location.state) {
      const edit = location.state.edit;
      if (edit) {
        setIsEdit(true);
        history.replace(location.pathname, {});
      }
    }
  }, [history, location]);

  const isAccess = useMemo(() => {
    return (
      isView &&
      Boolean(
        data?.employee_leave_approver?.find(
          item => item.approver === identity?.id,
        ),
      )
    );
  }, [identity, data, isView]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async values => {
        values.start_date = moment(values.start_date).format(DATE_FORMAT);
        values.end_date = moment(values.end_date).format(DATE_FORMAT);
        values.total_hours = Number(values.total_hours);
        delete values.employee_name;

        if (isEdit) {
          const response = await update(values);
          if (response) {
            delete response.members;
            setData(prev => ({ ...prev, ...response }));
            setIsEdit(false);
          }
        }
        if (isCreate) {
          create(values);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <>
      <PageTitle
        title={
          isView
            ? 'Leave application detail'
            : isEdit
            ? 'Edit leave application'
            : 'Create leave application'
        }
      />
      <WrapperMainItem>
        <Form form={form} labelAlign="left">
          <Form.Item hidden name="id">
            <Input hidden />
          </Form.Item>
          <Form.Item hidden name="employee_id">
            <Input hidden />
          </Form.Item>

          <FormItem
            name="employee_name"
            label="Employee Name"
            rules={FORM_RULES.employee_id}
          >
            <Select
              {...(isView ? selectProps : {})}
              size="large"
              placeholder="Please choose employee"
              onChange={e => {
                form.setFieldsValue({ employee_id: e });
              }}
            >
              {employees?.map((item, index) => (
                <Option key={index} value={item.id}>
                  {item.first_name + ' ' + item.last_name}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem name="title" label="Title" rules={FORM_RULES.title}>
            <Input
              {...(isView ? inputViewProps : {})}
              size="large"
              placeholder={!isView ? 'Title' : ''}
            />
          </FormItem>

          <FormItem name="description" label="Description">
            {isView ? (
              <WrapperText>{data?.description}</WrapperText>
            ) : (
              <Input.TextArea
                {...(isView ? textareaViewProps : {})}
                size="large"
              />
            )}
          </FormItem>

          <FormItem
            name="start_date"
            label="Start date"
            rules={FORM_RULES.start_date}
          >
            <DatePicker
              {...(isView ? datePickerViewProps : {})}
              size="large"
              format={DATE_FORMAT}
              style={{ width: '100%' }}
              onChange={e => setData({ ...data, start_date: e })}
            />
          </FormItem>

          <FormItem
            name="end_date"
            label="End date"
            rules={FORM_RULES.end_date}
          >
            <DatePicker
              {...(isView ? datePickerViewProps : {})}
              size="large"
              format={DATE_FORMAT}
              style={{ width: '100%' }}
              onChange={e => setData({ ...data, end_date: e })}
            />
          </FormItem>

          <FormItem
            name="total_hours"
            label="Total hours"
            rules={FORM_RULES.total_hours}
          >
            <Input
              {...(isView ? inputViewProps : {})}
              readOnly={!data?.start_date || !data?.end_date}
              size="large"
            />
          </FormItem>

          {isView && (
            <FormItem name="approval_status" label="Approval status">
              <WrapperText>{data?.approval_status}</WrapperText>
            </FormItem>
          )}

          <FormItem
            name="working_type"
            label="Working Type"
            rules={FORM_RULES.working_type}
          >
            <Select
              {...(isView && selectProps)}
              size="large"
              placeholder="Please choose working type"
            >
              {WORKING_TYPE.map((item, index) => (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </WrapperMainItem>
      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <PageButton
              block
              size="large"
              shape="round"
              onClick={() =>
                isEdit ? setIsEdit(false) : history.push('/leave_applications')
              }
            >
              Cancel
            </PageButton>
          </Col>
          <Col>
            <PageButton
              loading={loading}
              block
              size="large"
              shape="round"
              type="primary"
              onClick={() => {
                if (isEdit) {
                  handleSubmit();
                } else if (isView) {
                  setIsEdit(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (isCreate) {
                  handleSubmit();
                }
              }}
            >
              {isView ? 'Edit' : 'Submit'}
            </PageButton>
          </Col>
          {isAccess && isView && data?.approval_status !== 'APPROVED' && (
            <Col>
              <PageButton
                loading={loading}
                block
                size="large"
                shape="round"
                type="primary"
                onClick={() => approve(id)}
              >
                Approve
              </PageButton>
            </Col>
          )}
          {isAccess && isView && data?.approval_status !== 'REJECTED' && (
            <Col>
              <PageButton
                loading={loading}
                block
                size="large"
                shape="round"
                type="primary"
                danger
                onClick={() => reject(id)}
              >
                Reject
              </PageButton>
            </Col>
          )}
        </Row>
      </WrapperButton>
    </>
  );
};

const WrapperMainItem = styled(CardLayout)`
  padding: 3em;
`;

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;

const WrapperText = styled.span`
  padding-left: 10px;
  font-size: 16px;
  color: #000000d9;
`;

const PageButton = styled(Button)`
  width: 120px;
`;

const FormItem = styled(Form.Item)`
  align-items: center;

  label {
    font-weight: 500;
    min-width: 150px;
  }
`;
