/**
 *
 * ProjectModal
 *
 */
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { DialogModal } from 'app/components/DialogModal';
import { Button, Form, Select, Spin } from 'antd';
import { useHandleProject } from './useHandleProject';
import { SelectValue } from 'antd/lib/select';
import { ProjectDetailMessages } from 'app/pages/ProjectPage/ProjectDetailPage/messages';
import { useDispatch, useSelector } from 'react-redux';
import { useEmployeeProjectSlice } from '../Projects/slice';
import {
  selectEmployeeProjectAddFailed,
  selectEmployeeProjectAddSuccess,
  selectEmployeeProjectEditFailed,
  selectEmployeeProjectEditSuccess,
} from '../Projects/slice/selectors';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProject: any;
  setSelectedProject: (member: any) => void;
}
const { Option } = Select;

const allocations: number[] = [2];
for (let i = 4; i <= 40; i += 4) {
  allocations.push(i);
}

export const ProjectModal = memo((props: Props) => {
  const { t } = useTranslation();
  const { id, open, setOpen, selectedProject, setSelectedProject } = props;
  const [memberForm] = Form.useForm();
  const { notify } = useNotify();

  const [isAddProject, setIsAddProject] = useState(true);
  const [searchLoad, setSearchLoad] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const [value, setValue] = useState('');
  const [allocation, setAllocation] = useState<SelectValue>();
  const { loadingProject, fetchProjects } = useHandleProject();

  const { actions } = useEmployeeProjectSlice();
  const dispatch = useDispatch();

  const addSuccess = useSelector(selectEmployeeProjectAddSuccess);
  const addFailed = useSelector(selectEmployeeProjectAddFailed);
  const editSuccess = useSelector(selectEmployeeProjectEditSuccess);
  const editFailed = useSelector(selectEmployeeProjectEditFailed);

  const handleProject = async values => {
    if (selectedProject) {
      dispatch(actions.editProject({ ...values, employee: id }));
    } else {
      dispatch(actions.addProject({ ...values, employee: id }));
    }
  };

  useEffect(() => {
    if (addSuccess) {
      setOpen(false);
      memberForm.resetFields();
      notify({
        type: ToastMessageType.Info,
        message: 'Add success',
        duration: 2,
      });
    } else if (addFailed) {
      setOpen(false);
      memberForm.resetFields();
      notify({
        type: ToastMessageType.Error,
        message: 'Add failed',
        duration: 2,
      });
    }
  }, [addFailed, addSuccess, memberForm, notify, setOpen]);

  useEffect(() => {
    if (editSuccess) {
      setOpen(false);
      memberForm.resetFields();
      notify({
        type: ToastMessageType.Info,
        message: 'Update success',
        duration: 2,
      });
    } else if (editFailed) {
      setOpen(false);
      memberForm.resetFields();
      notify({
        type: ToastMessageType.Error,
        message: 'Update failed',
        duration: 2,
      });
    }
  }, [editFailed, editSuccess, memberForm, notify, setOpen]);

  const handleSearch = async value => {
    if (value) {
      setSearchLoad(true);
      const response = await fetchProjects(value);
      if (response) {
        setProjects(response);
        setSearchLoad(false);
      }
    } else {
      setProjects([]);
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

  const options = projects?.map(project => (
    <Option key={project.id} value={project.id}>
      {project.name}
    </Option>
  ));

  useEffect(() => {
    if (selectedProject) {
      (async () => {
        const response = await fetchProjects(selectedProject.project_name);
        if (response) {
          setProjects(response);
        }
        memberForm.setFieldsValue({
          project: selectedProject.project_id,
          project_role: selectedProject.project_role,
          allocation: selectedProject.allocation,
        });
        setIsAddProject(false);
      })();
    }
  }, [fetchProjects, memberForm, selectedProject]);

  return (
    <>
      <DialogModal
        title={isAddProject ? 'Add project' : 'Edit project'}
        isOpen={open}
        handleCancel={() => {
          setOpen(false);
          if (selectedProject) {
            setSelectedProject(null);
            setProjects(undefined);
          }
          setIsAddProject(true);
          memberForm.resetFields();
        }}
      >
        <Form
          form={memberForm}
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={handleProject}
        >
          <FormSearchItem
            name="project"
            label="Project"
            rules={[
              {
                required: true,
                message: 'Please select project',
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
              disabled={selectedProject ? true : false}
              placeholder={t('Enter name')}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={searchLoad ? <Spin size="default" /> : null}
            >
              {options}
            </Select>
          </FormSearchItem>
          <FormSearchItem
            name="project_role"
            label="Project role"
            rules={[
              {
                required: true,
                message: 'Please select role',
              },
            ]}
          >
            <Select size="large" placeholder="Select role">
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
            name="allocation"
            label="Allocation"
            rules={[
              {
                required: true,
                message: 'Please select allocation',
              },
            ]}
          >
            <Select
              size="large"
              placeholder="Select allocation"
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
            <Button
              loading={loadingProject}
              htmlType="submit"
              type="primary"
              shape="round"
              size="large"
            >
              Submit
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
