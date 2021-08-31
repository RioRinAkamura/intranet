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
import _ from 'lodash';

interface Props {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedProject: any;
  setSelectedProject: (member: any) => void;
}
const { Option } = Select;

const allocations: number[] = [2, ..._.range(4, 44, 4)];

export const ProjectModal = memo((props: Props) => {
  const { t } = useTranslation();
  const { id, open, setOpen, selectedProject, setSelectedProject } = props;
  const [memberForm] = Form.useForm();
  const { notify } = useNotify();

  const [isAddProject, setIsAddProject] = useState(true);
  const [searchLoad, setSearchLoad] = useState(false);
  const [projects, setProjects] = useState<any>([]);
  const [value, setValue] = useState('');
  const { loadingProject, fetchProjects } = useHandleProject();

  const { actions } = useEmployeeProjectSlice();
  const dispatch = useDispatch();

  const addSuccess = useSelector(selectEmployeeProjectAddSuccess);
  const addFailed = useSelector(selectEmployeeProjectAddFailed);
  const editSuccess = useSelector(selectEmployeeProjectEditSuccess);
  const editFailed = useSelector(selectEmployeeProjectEditFailed);

  const handleProject = async values => {
    const _values = {
      ...values,
      project_id: values.project,
      allocation: values.allocation,
      project_role: values.project_role,
      employee: id,
    };
    if (selectedProject) {
      dispatch(actions.editProject(_values));
    } else {
      dispatch(actions.addProject(_values));
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
          project: selectedProject.project.id,
          project_role: selectedProject.project_role,
          allocation: selectedProject.allocation,
        });
        setIsAddProject(false);
      })();
    }
  }, [fetchProjects, memberForm, selectedProject]);

  function handleCancel() {
    setOpen(false);
    if (selectedProject) {
      setSelectedProject(null);
      setProjects(undefined);
    }
    setIsAddProject(true);
    memberForm.resetFields();
  }

  return (
    <>
      <StyledDialogModal
        title={isAddProject ? 'Add project' : 'Edit project'}
        isOpen={open}
        handleCancel={handleCancel}
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
              placeholder="Enter name"
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
            <Select showSearch size="large" placeholder="Select allocation">
              {allocations.map((item, index: number) => {
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
              key="back"
              size="large"
              shape="round"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              loading={loadingProject}
              size="large"
              shape="round"
              htmlType="submit"
              type="primary"
            >
              Submit
            </Button>
          </ModalButton>
        </Form>
      </StyledDialogModal>
    </>
  );
});

const FormSearchItem = styled(Form.Item)``;

const StyledDialogModal = styled(DialogModal)`
  .ant-modal-body {
    padding: 0;
  }
  .ant-form-item {
    margin: 24px;
  }
`;

const ModalButton = styled.div`
  text-align: right;
  margin-top: 48px;
  padding: 10px 16px;
  border-top: 1px solid #f0f0f0;
  button {
    margin-left: 8px;
  }
`;
