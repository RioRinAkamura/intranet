import {
  Employee,
  Member,
} from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import { DatePicker, Form, FormInstance, message, Select, Spin } from 'antd';
import { SelectValue } from 'antd/lib/select';
import { ProjectDetailMessages } from 'app/pages/ProjectPage/ProjectDetailPage/messages';
import { useProjectDetail } from 'app/pages/ProjectPage/ProjectDetailPage/useProjectDetail';
import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { datePickerViewProps } from 'utils/types';
import moment from 'moment';

const FormSearchItem = Form.Item;
const { Option } = Select;
const DATE_FORMAT = 'MM-DD-YYYY';
interface Props {
  projId: string;
  form: FormInstance;
  isEdit?: boolean;
  member?: Member;
}

export const AddMember = memo((props: Props) => {
  const { form, isEdit, member } = props;
  const { t } = useTranslation();
  const {
    roles,
    allocations,
    fetchUser,
    getRoles,
    getAllocations,
  } = useProjectDetail();
  // state
  const [allocation, setAllocation] = useState<SelectValue>();
  const [employees, setEmployees] = useState<Employee[] | undefined>([]);
  const [searchLoad, setSearchLoad] = useState(false);

  // func
  const handleSearch = async value => {
    try {
      setSearchLoad(true);
      const response = await fetchUser(value);
      if (response) {
        setEmployees(response);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setSearchLoad(false);
    }
  };

  const disabledDate = (current: moment.Moment) => {
    return current > moment().endOf('day');
  };

  // hooks
  useEffect(() => {
    getRoles();
    getAllocations();
  }, [getRoles, getAllocations]);

  useEffect(() => {
    if (member) {
      form.setFieldsValue({
        members: {
          member_id: member.member.first_name + ' ' + member.member.last_name,
          allocation: member.allocation,
          project_role: member.project_role,
          joined_at: member.joined_at ? moment(member.joined_at) : '',
        },
      });
    }
  }, [member, form]);

  const options = employees?.map(employee => (
    <Option key={employee.id} value={employee.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          {employee.first_name} {employee.last_name}
        </span>
        <span style={{ width: '60%' }}>
          {employee.code} - {employee.email}
        </span>
      </div>
    </Option>
  ));

  return (
    <Form form={form} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
      <FormSearchItem
        name={['members', 'member_id']}
        label={t(ProjectDetailMessages.memberFormEmployeeLabel())}
        rules={[
          {
            required: true,
            message: t(ProjectDetailMessages.memberFormEmployeeEmpty()),
          },
        ]}
      >
        <Select
          showSearch
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption={false}
          size="large"
          loading={searchLoad}
          // disabled={selectedMember ? true : false}
          placeholder={t(ProjectDetailMessages.memberFormEmployeePlaceholder())}
          onSearch={handleSearch}
          onFocus={() => handleSearch(' ')}
          notFoundContent={searchLoad ? <Spin size="default" /> : null}
        >
          {options}
        </Select>
      </FormSearchItem>
      <FormSearchItem
        name={['members', 'project_role']}
        label={t(ProjectDetailMessages.memberFormProjectRoleLabel())}
        rules={[
          {
            required: true,
            message: t(ProjectDetailMessages.memberFormProjectRoleEmpty()),
          },
        ]}
      >
        <Select
          size="large"
          placeholder={t(
            ProjectDetailMessages.memberFormProjectRolePlaceholder(),
          )}
        >
          {roles &&
            roles.map((item, index: number) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
        </Select>
      </FormSearchItem>
      <FormSearchItem
        name={['members', 'allocation']}
        label={t(ProjectDetailMessages.memberFormAllocationLabel())}
        rules={[
          {
            required: true,
            message: t(ProjectDetailMessages.memberFormAllocationEmpty()),
          },
        ]}
      >
        <Select
          size="large"
          placeholder={t(
            ProjectDetailMessages.memberFormAllocationPlaceholder(),
          )}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => option?.value === Number(input)}
          onSearch={value => {
            setAllocation(value);
          }}
          onInputKeyDown={event => {
            if (event.key === 'Enter') {
              if (!allocations.includes(Number(allocation))) {
                allocations.push(Number(allocation));
                form.setFieldsValue({
                  members: { allocation: Number(allocation) },
                });
              }
            }
          }}
        >
          {allocations &&
            allocations.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
        </Select>
      </FormSearchItem>
      {isEdit && (
        <FormSearchItem
          label="Joined"
          name={['members', 'joined_at']}
          rules={[
            {
              required: true,
              message: 'Please select joined date',
            },
          ]}
        >
          <DatePicker
            {...(!isEdit ? datePickerViewProps : {})}
            format={DATE_FORMAT}
            disabledDate={disabledDate}
            style={{ width: '100%' }}
            size="large"
            placeholder="Select joined date"
          />
        </FormSearchItem>
      )}
    </Form>
  );
});
