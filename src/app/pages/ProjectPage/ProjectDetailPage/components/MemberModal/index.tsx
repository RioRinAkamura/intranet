/**
 *
 * MemberModal
 *
 */
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { DialogModal } from 'app/components/DialogModal';
import { Button, Form, FormInstance, Select, Spin } from 'antd';
import { models } from '@hdwebsoft/boilerplate-api-sdk';
import { useProjectDetail } from '../../useProjectDetail';
import { useHandleMember } from './useHandleMember';
import { ProjectDetailMessages } from '../../messages';

interface Props {
  form: FormInstance;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMember: any;
  setSelectedMember: (member: any) => void;
}
const { Option } = Select;

const allocations = [
  0.5,
  1.0,
  1.5,
  2.0,
  2.5,
  3.0,
  3.5,
  4.0,
  4.5,
  5.0,
  5.5,
  6.0,
  6.5,
  7.0,
  7.5,
  8.0,
];

type Employee = models.hr.Employee;

export const MemberModal = memo((props: Props) => {
  const { t } = useTranslation();
  const { form, open, setOpen, selectedMember, setSelectedMember } = props;
  const [memberForm] = Form.useForm();

  const [isAddMember, setIsAddMember] = useState(true);
  const [searchLoad, setSearchLoad] = useState(false);
  const [employees, setEmployees] = useState<Employee[] | undefined>([]);
  const [value, setValue] = useState('');
  const { fetchUser } = useProjectDetail();
  const { loadingMember, addMember, editMember } = useHandleMember();

  const handleAddMember = async values => {
    const members = form.getFieldValue('members');
    const employee = employees?.find(
      employee => employee.id === values.members.employee,
    );
    if (selectedMember) {
      // members.splice(selectedMember.index, 1);
      // members.push({ ...values.members, employee: employee });
      const project_id = form.getFieldValue('id');
      const response = await editMember(project_id, values);
      console.log(values);
      if (response) {
        members[selectedMember.index] = {
          ...members[selectedMember.index],
          allocation: values.members.allocation,
          project_role: values.members.project_role,
        };
        console.log(members);
        form.setFieldsValue({
          members: members,
        });
        setIsAddMember(true);
        setOpen(false);
      }
    } else {
      const project_id = form.getFieldValue('id');
      const response = await addMember(project_id, values);
      if (response) {
        if (members) {
          members.push({
            ...values.members,
            employee: employee,
            allocation: response.allocation,
          });
          form.setFieldsValue({
            members: members,
          });
          setOpen(false);
          memberForm.resetFields();
        } else {
          form.setFieldsValue({
            members: [
              {
                employee: employee,
                project_role: values.members.project_role,
                allocation: values.members.allocation,
              },
            ],
          });
        }
        setOpen(false);
        memberForm.resetFields();
      }
    }
  };

  const handleSearch = async value => {
    if (value) {
      setSearchLoad(true);
      const response = await fetchUser(value);
      if (response) {
        setEmployees(response);
        setSearchLoad(false);
      }
    } else {
      setEmployees([]);
    }
  };

  const handleChange = value => {
    setValue(value);
  };

  const role = [
    {
      name: t(ProjectDetailMessages.memberPM()),
      value: 'PM',
    },
    {
      name: t(ProjectDetailMessages.memberTL()),
      value: 'TL',
    },
    {
      name: t(ProjectDetailMessages.memberQC()),
      value: 'QC',
    },
    {
      name: t(ProjectDetailMessages.memberDEV()),
      value: 'DEV',
    },
    {
      name: t(ProjectDetailMessages.memberOTHER()),
      value: 'OTHER',
    },
  ];

  const options = employees?.map(employee => (
    <Option key={employee.id} value={employee.id}>
      {employee.first_name} {employee.last_name}
    </Option>
  ));

  useEffect(() => {
    if (selectedMember) {
      (async () => {
        const response = await fetchUser(selectedMember.employee.email);
        if (response) {
          setEmployees(response);
        }
        memberForm.setFieldsValue({
          members: {
            employee: selectedMember.employee.id,
            project_role: selectedMember.project_role,
            allocation: selectedMember.allocation,
          },
        });
        setIsAddMember(false);
      })();
    }
  }, [fetchUser, memberForm, selectedMember]);

  return (
    <>
      <DialogModal
        title={
          isAddMember
            ? t(ProjectDetailMessages.addMember())
            : t(ProjectDetailMessages.editMember())
        }
        isOpen={open}
        handleCancel={() => {
          setOpen(false);
          if (selectedMember) {
            setSelectedMember(null);
            setEmployees(undefined);
          }
          setIsAddMember(true);
          memberForm.resetFields();
        }}
      >
        <Form
          form={memberForm}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={handleAddMember}
        >
          <FormSearchItem
            name={['members', 'employee']}
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
              value={value}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              size="large"
              loading={searchLoad}
              disabled={selectedMember ? true : false}
              placeholder={t(
                ProjectDetailMessages.memberFormEmployeePlaceholder(),
              )}
              onSearch={handleSearch}
              onChange={handleChange}
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
              {role &&
                role.map((item, index: number) => {
                  return (
                    <Option key={index} value={item.value}>
                      {item.name}
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
          <ModalButton>
            <Button
              loading={loadingMember}
              htmlType="submit"
              type="primary"
              shape="round"
              size="large"
            >
              {t(ProjectDetailMessages.buttonSubmit())}
            </Button>
          </ModalButton>
        </Form>
      </DialogModal>
    </>
  );
});

const FormSearchItem = styled(Form.Item)``;

const ModalButton = styled.div`
  text-align: center;
  button {
    padding: 0 2em !important;
  }
`;
