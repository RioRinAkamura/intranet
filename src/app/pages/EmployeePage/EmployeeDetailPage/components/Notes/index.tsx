/**
 *
 * Notes
 *
 */
import React, { memo, useEffect, useState, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Table, Tooltip, Form as FormAntd, Row, Col } from 'antd';
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import { DeleteOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { EmployeeNote } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';

import { config } from 'config';
import { DialogModal } from 'app/components/DialogModal';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';
import Button from 'app/components/Button';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { Wrapper } from 'styles/StyledCommon';
import { DeleteModal } from 'app/components/DeleteModal';

import { useNotesSlice } from './slice';
import {
  selectEmployeeNotes,
  selectEmployeeNoteIsFilter,
  selectEmployeeNotesParams,
  selectEmployeeNoteIsSuccess,
} from './slice/selectors';
import { EmployeeNoteMessages } from './messages';
import { Actions } from './components/Actions';
import { Form } from './components/Form';
import { api } from 'utils/api';

const DATE_FORMAT = config.DATE_FORMAT;

interface NotesProps {
  employeeId: string;
}

export const Notes = memo(({ employeeId }: NotesProps) => {
  const { t } = useTranslation();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [isModalMultiDeleteVisible, setIsModalMultiDeleteVisible] = useState(
    false,
  );
  const [isDeleteCategory, setIsDeleteCategory] = React.useState<boolean>(
    false,
  );
  const [categoryId, setCategoryId] = React.useState<string>('');

  const { notify } = useNotify();

  const [note, setNote] = useState<EmployeeNote>();

  const [form] = FormAntd.useForm();

  const { actions } = useNotesSlice();

  const dispatch = useDispatch();

  const params = useSelector(selectEmployeeNotesParams);
  const isFilter = useSelector(selectEmployeeNoteIsFilter);
  const isSuccess = useSelector(selectEmployeeNoteIsSuccess);
  const employeeNoteState = useSelector(selectEmployeeNotes);

  const {
    setSelectedRows,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(employeeNoteState, actions);

  const { getColumnSorterProps, getColumnSearchInputProps } = useTableConfig(
    employeeNoteState,
    EmployeeNoteMessages,
    setFilterText,
  );

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<EmployeeNote> | SorterResult<EmployeeNote>[],
  ) => {
    setOrdering(sorter);
  };

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: EmployeeNote[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleNoteCreate = () => {
    dispatch(
      actions.createEmployeeNote({
        ...form.getFieldsValue(),
        employee: employeeId,
        date: moment(form.getFieldsValue().date).format(DATE_FORMAT),
      }),
    );
  };

  const handleNoteUpdate = () => {
    dispatch(
      actions.updateEmployeeNote({
        ...form.getFieldsValue(),
        date: moment(form.getFieldValue('date')).format(DATE_FORMAT),
        employee_id: employeeId,
        id: note?.id,
      }),
    );
  };

  const handleNoteDelete = () => {
    dispatch(
      actions.deleteEmployeeNote({
        employee_id: employeeId,
        id: note?.id,
      }),
    );
  };

  const handleMultiDelete = () => {
    dispatch(
      actions.deleteMultipleEmployeeNotes({
        employee_id: employeeId,
        noteIds: (employeeNoteState.selectedRowKeys as string[]) || [],
      }),
    );
  };

  const handleCancel = () => {
    setIsView(false);
    setIsCreate(false);
    setIsUpdate(false);
    form.resetFields();
  };

  const handleSubmit = () => {
    if (isUpdate) {
      handleNoteUpdate();
    } else {
      setIsView(false);
      setIsUpdate(true);
    }
    if (isCreate) {
      handleNoteCreate();
    }
  };

  const onDeleteCategory = async () => {
    try {
      await api.hr.employee.note.category.delete(categoryId);
      handleCancel();
      setIsDeleteCategory(false);
      dispatch(actions.fetchEmployeeNotes({ employeeId, params }));

      notify({
        type: ToastMessageType.Info,
        message: 'Delete Successfully',
        duration: 2,
      });
    } catch (error) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete Failed',
        duration: 2,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setIsCreate(false);
      setIsUpdate(false);
    }
  }, [form, isSuccess]);

  useEffect(() => {
    setNote(note);
  }, [note]);

  useEffect(() => {
    if (!isFilter) {
      dispatch(actions.fetchEmployeeNotes({ employeeId, params }));
    }
  }, [actions, dispatch, employeeId, isFilter, params]);

  useEffect(() => {
    if (employeeNoteState.deleteIsSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete Successfully',
        duration: 2,
      });
      setIsModalMultiDeleteVisible(false);
      setIsDelete(false);
      if (employeeNoteState.isDeleteMultiple) {
        dispatch(
          actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }),
        );
      }
    } else if (employeeNoteState.deleteIsFailure) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete Failed',
        duration: 2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeNoteState.deleteIsFailure, employeeNoteState.deleteIsSuccess]);
  const columns: ColumnProps<EmployeeNote>[] = [
    {
      title: t(EmployeeNoteMessages.listType()),
      dataIndex: 'category',
      ...getColumnSorterProps('category', 0),
      ...getColumnSearchInputProps(['category']),
      render: text => text.name,
    },
    {
      title: t(EmployeeNoteMessages.listSummary()),
      dataIndex: 'summary',
      ...getColumnSorterProps('summary', 1),
      ...getColumnSearchInputProps(['summary']),
    },
    {
      title: t(EmployeeNoteMessages.listDate()),
      dataIndex: 'date',
      ...getColumnSorterProps('date', 2),
    },
    {
      title: t(EmployeeNoteMessages.listContent()),
      dataIndex: 'content',
      ...getColumnSorterProps('content', 3),
    },
    {
      title: t(EmployeeNoteMessages.listActions()),
      dataIndex: 'id',
      render: (id, record: EmployeeNote) => (
        <Actions
          t={t}
          note={record}
          setNote={setNote}
          setIsView={setIsView}
          setIsUpdate={setIsUpdate}
          setIsDelete={setIsDelete}
        />
      ),
    },
  ];

  const descriptionDelete = (
    <>
      You're about to permanently delete employee note
      <Tooltip
        title={<div>{isCopy ? 'Copied!' : 'Click to copy!'}</div>}
        onVisibleChange={visible => visible === true && setIsCopy(false)}
      >
        <strong
          style={{ cursor: 'pointer' }}
          onClick={() => {
            if (note?.id) {
              navigator.clipboard.writeText(note?.id);
              setIsCopy(true);
            }
          }}
        >
          {' '}
          {note?.id}
        </strong>
      </Tooltip>
      . This will also delete any references to employee note.
    </>
  );

  return (
    <Wrapper>
      <Row align="middle" justify="center">
        <Col span={8}>
          <Row justify="start">
            {employeeNoteState.selectedRowKeys &&
              employeeNoteState.selectedRowKeys.length > 0 && (
                <Button
                  danger
                  disabled={
                    !employeeNoteState?.selectedRowKeys?.length ||
                    employeeNoteState?.selectedRowKeys?.length === 0
                  }
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    setIsModalMultiDeleteVisible(true);
                  }}
                />
              )}
          </Row>
        </Col>
        <Col span={16}>
          <Row justify="end">
            <StyledButton
              type="primary"
              icon={<FormOutlined />}
              onClick={() => {
                setIsCreate(true);
                form.resetFields();
              }}
              size="middle"
            >
              {t(EmployeeNoteMessages.createNoteBtn())}
            </StyledButton>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            bordered
            dataSource={employeeNoteState.notes}
            columns={columns}
            rowKey="id"
            loading={employeeNoteState.loading}
            onChange={handleTableChange}
            scroll={{ x: 1100 }}
            rowSelection={{
              selectedRowKeys: employeeNoteState.selectedRowKeys,
              onChange: handleSelectedRows,
            }}
            pagination={{
              ...employeeNoteState.pagination,
              onChange: (page: number, pageSize?: number) => {
                setPagination({ current: page, pageSize });
              },
              showTotal: (total, range) => (
                <div>
                  Showing{' '}
                  <span>
                    {range[0]}-{range[1]}
                  </span>{' '}
                  of {total} items
                </div>
              ),
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
            }}
          />
        </Col>
      </Row>
      <DialogModal
        isOpen={isCreate || isUpdate || isView}
        cancelText={t(EmployeeNoteMessages.modalCancelButton())}
        okText={
          isUpdate || isCreate
            ? t(EmployeeNoteMessages.modalSubmitButton())
            : t(EmployeeNoteMessages.modalEditButton())
        }
        title={
          isUpdate
            ? t(EmployeeNoteMessages.modalEditTitle())
            : isView
            ? t(EmployeeNoteMessages.modalViewTitle())
            : t(EmployeeNoteMessages.modalCreateTitle())
        }
        handleCancel={handleCancel}
        handleSubmit={handleSubmit}
      >
        <Form
          t={t}
          form={form}
          note={!isCreate ? note : undefined}
          isView={!isCreate ? isView : false}
          setVisible={setIsDeleteCategory}
          setCategoryId={setCategoryId}
        />
      </DialogModal>

      <DeleteConfirmModal
        visible={isDelete}
        title={`Remove ${note?.id}`}
        description={descriptionDelete}
        handleCancel={() => setIsDelete(false)}
        handleOk={handleNoteDelete}
        answer={note?.id}
      />

      <DeleteModal
        open={isModalMultiDeleteVisible}
        handleDelete={handleMultiDelete}
        handleCancel={() => setIsModalMultiDeleteVisible(false)}
        content="Are you sure you want to delete this information?"
      />

      <DeleteModal
        open={isDeleteCategory}
        handleDelete={onDeleteCategory}
        handleCancel={() => setIsDeleteCategory(false)}
        content="All notes with this category will be deleted. Are you sure?"
      />
    </Wrapper>
  );
});

const StyledButton = styled(Button)`
  margin-bottom: 10px;
  svg {
    vertical-align: baseline;
  }
`;
