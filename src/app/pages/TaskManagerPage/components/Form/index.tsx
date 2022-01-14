import React from 'react';
import { FORM_RULES } from 'constants/task';

import { Form, FormInstance, Select, Input } from 'antd';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { UpdateTaskParam } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { SelectOption } from '@hdwebsoft/intranet-api-sdk/libs/type';
import { Avatar } from 'app/components/Avatar';

const { Option } = Select;

interface FormProps {
  form: FormInstance;
  isView?: boolean;
  employees: any[];
  projects: any[];
  statuses: SelectOption[];
  taskUpdate?: UpdateTaskParam;
}
export const TaskForm: React.FC<FormProps> = ({
  form,
  isView,
  employees,
  projects,
  taskUpdate,
  statuses,
}) => {
  React.useEffect(() => {
    if (taskUpdate) {
      form.setFieldsValue({
        ...taskUpdate,
      });
    }
  }, [form, taskUpdate]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="title" rules={FORM_RULES.TITLE} label="Title">
        <Input size="large" />
      </Form.Item>
      <Form.Item name="project_id" rules={FORM_RULES.PROJECT} label="Project">
        <Select placeholder="Project" disabled={isView} size="large">
          {projects.map(project => {
            return <Option value={project.id}>{project.name}</Option>;
          })}
        </Select>
      </Form.Item>
      <Form.Item name="status" label="Status" initialValue={'Open'}>
        <Select disabled={isView} placeholder="Status" size="large">
          {statuses.map(i => (
            <Option value={i.value}>{i.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="assignee_id" label="Assignee">
        <Select
          showSearch
          placeholder="Assignee"
          disabled={isView}
          size="large"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          filterSort={(optionA, optionB) =>
            optionA.children
              .toLowerCase()
              .localeCompare(optionB.children.toLowerCase())
          }
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
      <Form.Item name="description" label="Description">
        <RichEditor
          data={taskUpdate?.description}
          width="100%"
          callback={value => {
            form.setFieldsValue({ description: value });
          }}
          isView={isView}
        />
      </Form.Item>
    </Form>
  );
};
