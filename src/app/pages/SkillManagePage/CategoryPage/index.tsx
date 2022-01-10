import { Form, Popover, Tooltip } from 'antd';
import { useBreadCrumbContext } from 'app/components/Breadcrumbs/context';
import {
  useTableSlice,
  initialState,
} from 'app/components/TableListModel/slice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { CategoryMessages } from './messages';
import { useHandleDataTable } from 'app/components/TableListModel/useHandleDataTable';
import { Helmet } from 'react-helmet-async';
import PageTitle from 'app/components/PageTitle';
import { ColumnType } from 'antd/lib/table';
import { TotalSearchForm } from 'app/components/TotalSearchForm';
import TableListModel from 'app/components/TableListModel';
import styled from 'styled-components';
import { CardLayout } from 'app/components/CardLayout';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionIcon } from 'app/components/ActionIcon';
import { IconButton } from 'app/components/Button';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { DialogModal } from 'app/components/DialogModal';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { useHistory, useLocation } from 'react-router-dom';
import { DeleteType } from 'utils/types';
import { useSkillDetails } from '../useSkillDetails';
import { DetailForm } from './components/DetailForm';
import { RootState } from 'types';

interface Category {
  id: string;
  name: string;
  skills: string[];
}

const model = 'category';

export const CategoryPage: React.FC = () => {
  // BreadCrumb
  const { setBreadCrumb } = useBreadCrumbContext();
  React.useEffect(() => {
    setBreadCrumb('Skills / Categories');
  }, [setBreadCrumb]);
  const history = useHistory();
  const location = useLocation();
  const { notify } = useNotify();
  const dispatch = useDispatch();

  const [searchForm] = Form.useForm();
  const [form] = Form.useForm();

  const tableState = useSelector(
    (state: RootState) => state.category || initialState,
  );
  const { actions } = useTableSlice(model);
  const { params, loading } = tableState;

  // State
  const [isCreate, setIsCreate] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const isView = isCreate || isEdit ? false : true;

  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [textCopy, setTextCopy] = useState(false);

  const deleteSuccess = tableState?.deleteSuccess;
  const deleteFailed = tableState?.deleteFailed;

  const {
    skills,
    fetchAllCategory,
    fetchSkill,
    createCategory,
    updateCategory,
  } = useSkillDetails();

  const { setSearchText, resetSearch } = useHandleDataTable(
    tableState,
    actions,
  );

  useEffect(() => {
    fetchSkill();
    fetchAllCategory();
  }, [fetchSkill, fetchAllCategory]);

  useEffect(() => {
    if (location.pathname.includes('create')) {
      setIsCreate(true);
    } else {
      setIsCreate(false);
      setIsEdit(false);
    }
  }, [location.pathname]);

  const columns: ColumnType<Category>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 40,
      render: text => <span>{text}</span>,
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      width: 40,
      render: (value: string[]) =>
        skills
          .filter(skill => value.includes(skill.id))
          .map(skill => <div>{skill.name}</div>),
    },
    {
      width: 180,
    },
    {
      title: <ActionIcon />,
      dataIndex: 'id',
      width: 45,
      fixed: 'right',
      render: (text: string, record: Category) => {
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

  const moreButton = (id: string, record: Category) => (
    <>
      <Tooltip title="Edit">
        <IconButton
          shape="circle"
          icon={<EditOutlined />}
          size="small"
          onClick={() => {
            setIsEdit(true);
            setSelectedCategory(record);
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
            setSelectedCategory(record);
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
    if (selectedCategory) {
      dispatch(actions.delete({ id: selectedCategory.id, model: model }));
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
      You're about to permanently delete this category{' '}
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
        >{`${selectedCategory?.name}`}</strong>
      </Tooltip>
      . This will also delete any references to this category.
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

  const handleAddCategory = async () => {
    try {
      let values = await form.validateFields();
      values.skills = [];
      const response = await createCategory(values);
      if (response) {
        dispatch(actions.fetchList({ params: params, model }));
        setIsCreate(false);
        history.push('/skills/categories');
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCategory = async () => {
    try {
      const values = await form.validateFields();
      const response = await updateCategory(values);
      if (response) {
        dispatch(actions.fetchList({ params: params, model }));
        setIsEdit(false);
        history.push('/skills/categories');
        form.resetFields();
      }
    } catch (error) {
      console.log(error);
      setIsEdit(false);
      history.push('/skills/categories');
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsCreate(false);
    setIsEdit(false);
    history.push('/skills/categories');
    form.resetFields();
  };
  return (
    <>
      <Helmet>
        <title>Categories</title>
        <meta name="description" content="Categories" />
      </Helmet>
      <PageTitle title="Categories">
        <TotalSearchForm
          form={searchForm}
          value={params.search}
          loading={loading ? true : false}
          // messageTrans={CategoryMessages}
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
        handleSubmit={isEdit ? handleEditCategory : handleAddCategory}
      >
        <DetailForm form={form} category={selectedCategory} />
      </DialogModal>
      <DeleteConfirmModal
        type={DeleteType.NAME}
        visible={isModalVisible}
        handleOk={handleConfirmDelete}
        handleCancel={handleCancelDeleteModal}
        title={`Remove ${selectedCategory?.name}`}
        description={descriptionDelete}
        answer={`${selectedCategory?.name}`}
      />
    </>
  );
};

const Wrapper = styled(CardLayout)``;
