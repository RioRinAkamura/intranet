import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { DatePicker, Form, FormInstance, Select } from 'antd';
import { Avatar } from 'app/components/Avatar';
import moment from 'moment';
import React from 'react';

const { Option } = Select;

interface FormProps {
  form: FormInstance;
  isView?: boolean;
  employees: Employee[];
}
export const ProjectTimesheetForm = ({
  form,
  isView,
  employees,
}: FormProps) => {
  const today = new Date();

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="date" label="Date">
        <DatePicker
          defaultValue={moment(today)}
          style={{ width: '100%' }}
          allowClear={false}
          size="large"
        />
      </Form.Item>
      <Form.Item name="work_status" label="Work status">
        <Select size="large" showSearch>
          <Option value="1">ON TRACK</Option>;
          <Option value="2">OFF TRACK</Option>;
        </Select>
      </Form.Item>
      <Form.Item name="creators" label="Creators">
        <Select
          allowClear
          showSearch
          placeholder="Creators"
          disabled={isView}
          size="large"
          optionFilterProp="children"
          filterOption={(input, option) => {
            return (
              option?.children[2].toLowerCase().indexOf(input.toLowerCase()) >=
              0
            );
          }}
          filterSort={(optionA, optionB) => {
            return optionA.children[2]
              .toLowerCase()
              .localeCompare(optionB.children[2].toLowerCase());
          }}
        >
          {employees.map(employee => {
            return (
              <Option value={employee.id}>
                <Avatar
                  size={30}
                  src={employee.avatar}
                  name={employee.first_name + ' ' + employee.last_name}
                />{' '}
                {`${employee.first_name} ${employee.last_name}`}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    </Form>
  );
};
