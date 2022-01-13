import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { models } from '@hdwebsoft/intranet-api-sdk';
import { Form, Popover, Tooltip } from 'antd';
import { ColumnType } from 'antd/lib/table';
import styled from 'styled-components';
import PageTitle from 'app/components/PageTitle';
import { CardLayout } from 'app/components/CardLayout';
import TableListModel from 'app/components/TableListModel';
import { TotalSearchForm } from 'app/components/TotalSearchForm/Loadable';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import { useHandleDataTable } from 'app/components/TableListModel/useHandleDataTable';
import {
  initialState,
  useTableSlice,
} from 'app/components/TableListModel/slice';
import { SkillMessages } from './messages';
import { useTableConfig } from 'utils/tableConfig';
import { StyledLink } from 'styles/StyledCommon';
import { PrivatePath } from 'utils/url.const';
import { useHistory, useLocation } from 'react-router-dom';
import { DialogModal } from 'app/components/DialogModal';
import { DetailForm } from './components/DetailForm';
import { ActionIcon } from 'app/components/ActionIcon';
import { IconButton } from 'app/components/Button';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { ToastMessageType, useNotify } from 'app/components/ToastNotification';
import { DeleteType } from 'utils/types';
import { useSkillDetails } from '../useSkillDetails';
import { RootState } from 'types';

type Skill = models.hr.Skill;
const model = 'skill';

export const SkillListPage: React.FC = () => {
  // BreadCrumb
  const { setBreadCrumb } = useBreadCrumbContext();
  useEffect(() => {
    setBreadCrumb('Skills');
  }, [setBreadCrumb]);
  const history = useHistory();
  const location = useLocation();
  const { notify } = useNotify();

  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const tableState = useSelector(
    (state: RootState) => state.skill || initialState,
  );
  const { actions } = useTableSlice(model);
  const { params, loading } = tableState;

  // State
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const isView = isCreate || isEdit ? false : true;

  const [selectedSkill, setSelectedSkill] = useState<Skill>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textCopy, setTextCopy] = useState(false);

  const deleteSuccess = tableState?.deleteSuccess;
  const deleteFailed = tableState?.deleteFailed;

  const {
    categories,
    fetchAllCategory,
    createSkill,
    updateSkill,
  } = useSkillDetails();

  const { setFilterText, setSearchText, resetSearch } = useHandleDataTable(
    tableState,
    actions,
  );

  const { getColumnSorterProps, getColumnSearchInputProps } = useTableConfig(
    tableState,
    SkillMessages,
    setFilterText,
  );

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

  React.useEffect(() => {
    if (location.pathname.includes('create')) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
      setIsEdit(false);
    }
  }, [location.pathname]);

  const columns: ColumnType<Skill>[] = [
    {
      title: 'Category',
      dataIndex: 'category',
      width: 40,
      ...getColumnSorterProps('category', 1),
      ...getColumnSearchInputProps(['category']),
      render: text => {
        const category = categories.find(category => text === category.id);
        return (
          <StyledLink to={PrivatePath.SKILLS_CATEGORIES} title={category?.name}>
            {category?.name}
          </StyledLink>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 40,
      ...getColumnSorterProps('name', 2),
      ...getColumnSearchInputProps(['name']),
      render: text => <span>{text}</span>,
    },
    {
      width: 180,
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: Skill) => {
        return (
          <>
            <Popover
              content={() => moreButton(text, record)}
              placement="bottom"
            >
              <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
            </Popover>
          </>
        );
      },
    },
  ];

  const moreButton = (id: string, record: Skill) => (
    <>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            setIsEdit(true);
            console.log(record, 'record');
            // setSelectedSkill(record);
            form.setFieldsValue({ ...record });
          }}
        />
      </Tooltip>
      <Tooltip title="Remove">
        <IconButton
          danger
          shape="circle"
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            showDeleteModal();
            setSelectedSkill(record);
          }}
        />
      </Tooltip>
    </>
  );

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleConfirmDelete = () => {
    setIsModalVisible(false);
    if (selectedSkill) {
      dispatch(actions.delete({ id: selectedSkill.id, model: model }));
    }
  };

  const handleCancelDeleteModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (deleteSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete successful',
        duration: 2,
      });
    } else if (deleteFailed) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete failed',
        duration: 2,
      });
    }
  }, [deleteFailed, tableState, deleteSuccess, notify]);

  const descriptionDelete = (
    <p>
      You're about to permanently delete your skill{' '}
      <Tooltip
        title={<div>{textCopy ? 'Copied' : 'Click to copy'}</div>}
        onVisibleChange={visible => visible === true && setTextCopy(false)}
      >
        <strong
          id="deletedName"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            let copyText = document.getElementById('deletedName')?.innerText;
            if (copyText) {
              navigator.clipboard.writeText(copyText);
              setTextCopy(true);
            }
          }}
        >{`${selectedSkill?.name}`}</strong>
      </Tooltip>
      . This will also delete any references to your skill.
    </p>
  );

  const totalSearch = () => {
    const values = searchForm.getFieldValue('search');
    setSearchText(values);
  };

  const resetTotalSearch = () => {
    searchForm.setFieldsValue({ search: undefined });
    resetSearch();
  };

  const handleAddSkill = async () => {
    try {
      const values = await form.validateFields();
      const response = await createSkill(values);
      if (response) {
        dispatch(actions.fetchList({ params: params, model }));
        setIsCreate(false);
        history.push('/skills');
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditSkill = async () => {
    try {
      const values = await form.validateFields();
      const response = await updateSkill(values);
      if (response) {
        dispatch(actions.fetchList({ params: params, model }));
        setIsEdit(false);
        history.push('/skills');
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      setIsEdit(false);
      history.push('/skills');
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsCreate(false);
    setIsEdit(false);
    history.push('/skills');
    form.resetFields();
  };
  return (
    <>
      <Helmet>
        <title>Skills</title>
        <meta name="description" content="Skills" />
      </Helmet>
      <PageTitle title="Skills">
        <TotalSearchForm
          form={searchForm}
          value={params.search}
          loading={loading ? true : false}
          messageTrans={SkillMessages}
          onSearch={totalSearch}
          onReset={resetTotalSearch}
        />
      </PageTitle>
      <Wrapper>
        <TableListModel model={model} columns={columns} />
      </Wrapper>
      <DialogModal
        isOpen={!isView}
        cancelText="Cancel"
        okText={isEdit ? 'Edit' : 'Add'}
        handleCancel={handleCancel}
        handleSubmit={isEdit ? handleEditSkill : handleAddSkill}
      >
        <DetailForm form={form} />
      </DialogModal>
      <DeleteConfirmModal
        type={DeleteType.NAME}
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${selectedSkill?.name}`}
        description={descriptionDelete}
        answer={`${selectedSkill?.name}`}
      />
    </>
  );
};

const Wrapper = styled(CardLayout)``;
