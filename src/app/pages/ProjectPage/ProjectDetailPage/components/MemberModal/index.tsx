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
import { SelectValue } from 'antd/lib/select';

interface Props {
  form: FormInstance;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMember: any;
  setSelectedMember: (member: any) => void;
}
const { Option } = Select;

const allocations: number[] = [2];
for (let i = 4; i <= 40; i += 4) {
  allocations.push(i);
}

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
  const [allocation, setAllocation] = useState<SelectValue>();

  const handleAddMember = async values => {
    const members = form.getFieldValue('members');
    const employee = employees?.find(
      employee => employee.id === values.members.employee,
    );
    if (selectedMember) {
      const project_id = form.getFieldValue('id');
      const response = await editMember(project_id, values);
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
      if (project_id) {
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
      } else {
        if (members) {
          members.push({
            ...values.members,
            employee: employee,
            allocation: values.members.allocation,
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

  function handleCancel() {
    setOpen(false);
    if (selectedMember) {
      setSelectedMember(null);
      setEmployees(undefined);
    }
    setIsAddMember(true);
    memberForm.resetFields();
  }

  return (
    <>
      <DialogModal
        title={
          isAddMember
            ? t(ProjectDetailMessages.addMember())
            : t(ProjectDetailMessages.editMember())
        }
        isOpen={open}
        handleCancel={handleCancel}
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
                    memberForm.setFieldsValue({
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
          <ModalButton>
            <Button key="back" onClick={handleCancel}>
              {t(ProjectDetailMessages.cancel())}
            </Button>
            <Button loading={loadingMember} htmlType="submit" type="primary">
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
  text-align: right;
  button {
    padding: 0 2em !important;
    margin-left: 8px;
  }
`;
