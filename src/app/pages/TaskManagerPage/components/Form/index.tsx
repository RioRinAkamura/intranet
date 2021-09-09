import React from 'react';
import { FORM_RULES, STATUS } from 'constants/task';

import { Form, FormInstance, Select, Input } from 'antd';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { UpdateTaskParam } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

const { Option } = Select;

interface FormProps {
  form: FormInstance;
  isView?: boolean;
  employees: any[];
  projects: any[];
  taskUpdate?: UpdateTaskParam;
}
export const TaskForm: React.FC<FormProps> = ({
  form,
  isView,
  employees,
  projects,
  taskUpdate,
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
          {STATUS.map(i => (
            <Option value={i.value}>{i.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="assignee_id" label="Assignee">
        <Select placeholder="Assignee" disabled={isView} size="large">
          {employees.map(employee => {
            return (
              <Option value={employee.id}>
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
