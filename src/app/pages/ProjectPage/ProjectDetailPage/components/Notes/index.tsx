import React, { memo, useEffect, useState, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { Table, Tooltip, Form as FormAntd, Row, Col, Typography } from 'antd';
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import {
  DeleteOutlined,
  DislikeTwoTone,
  FormOutlined,
  LikeTwoTone,
  MinusCircleTwoTone,
} from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { ProjectNote } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

import { config } from 'config';
import { DialogModal } from 'app/components/DialogModal';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { useHandleDataTable } from 'app/pages/EmployeePage/EmployeeListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';
import Button from 'app/components/Button';
import { useNotify, ToastMessageType } from 'app/components/ToastNotification';
import { Wrapper } from 'styles/StyledCommon';
import { DeleteModal } from 'app/components/DeleteModal';
import {
  selectProjectNotes,
  selectProjectNoteIsFilter,
  selectProjectNotesParams,
  selectProjectNoteIsSuccess,
} from './slice/selectors';
import { Actions } from './components/Actions';

import { ProjectNoteMessages } from './messages';
import { api } from 'utils/api';
import { ActionIcon } from 'app/components/ActionIcon';
import { useNotesSlice } from './slice';
import { Form } from './components/Form';
import { useProjectDetail } from '../../useProjectDetail';

const DATE_FORMAT = config.DATE_FORMAT;

interface NotesProps {
  projectId: string;
}

const { Title } = Typography;

export const Notes = memo(({ projectId }: NotesProps) => {
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

  const [note, setNote] = useState<ProjectNote>();
  const [form] = FormAntd.useForm();
  const { actions } = useNotesSlice();
  const dispatch = useDispatch();
  const params = useSelector(selectProjectNotesParams);
  const isFilter = useSelector(selectProjectNoteIsFilter);
  const isSuccess = useSelector(selectProjectNoteIsSuccess);
  const projectNoteState = useSelector(selectProjectNotes);

  const {
    update,
    projectNoteScores,
    getProjectNoteScores,
  } = useProjectDetail();

  const {
    setSelectedRows,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(projectNoteState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchCheckboxProps,
  } = useTableConfig(projectNoteState, ProjectNoteMessages, setFilterText);

  const handleSelectedRows = (
    selectedRowKeys: Key[],
    selectedRows: ProjectNote[],
  ) => {
    setSelectedRows(selectedRowKeys, selectedRows);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<ProjectNote> | SorterResult<ProjectNote>[],
  ) => {
    setOrdering(sorter);
  };

  const handleNoteCreate = () => {
    dispatch(
      actions.createProjectNote({
        ...form.getFieldsValue(),
        project: projectId,
        date: moment(form.getFieldsValue().date).format(DATE_FORMAT),
      }),
    );
  };

  const handleNoteUpdate = () => {
    dispatch(
      actions.updateProjectNote({
        ...form.getFieldsValue(),
        date: moment(form.getFieldValue('date')).format(DATE_FORMAT),
        project_id: projectId,
        id: note?.id,
      }),
    );
  };

  const handleNoteDelete = () => {
    dispatch(
      actions.deleteProjectNote({
        project_id: projectId,
        id: note?.id,
      }),
    );
  };

  const handleMultiDelete = () => {
    dispatch(
      actions.deleteMultipleProjectNotes({
        project_id: projectId,
        noteIds: (projectNoteState.selectedRowKeys as string[]) || [],
      }),
    );
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

  const handleCancel = () => {
    setIsView(false);
    setIsCreate(false);
    setIsUpdate(false);
    form.resetFields();
  };

  const onDeleteCategory = async () => {
    try {
      await api.hr.project.note.category.delete(categoryId);
      handleCancel();
      setIsDeleteCategory(false);
      dispatch(actions.fetchProjectNotes({ projectId, params }));

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
    getProjectNoteScores();
  }, [note, getProjectNoteScores]);

  useEffect(() => {
    if (!isFilter) {
      dispatch(actions.fetchProjectNotes({ projectId, params }));
    }
  }, [actions, dispatch, projectId, isFilter, params]);

  useEffect(() => {
    if (projectNoteState.deleteIsSuccess) {
      notify({
        type: ToastMessageType.Info,
        message: 'Delete Successfully',
        duration: 2,
      });
      setIsModalMultiDeleteVisible(false);
      setIsDelete(false);
      if (projectNoteState.isDeleteMultiple) {
        dispatch(
          actions.selectedRows({ selectedRowKeys: [], selectedRows: [] }),
        );
      }
    } else if (projectNoteState.deleteIsFailure) {
      notify({
        type: ToastMessageType.Error,
        message: 'Delete Failed',
        duration: 2,
      });
    }
  }, [
    dispatch,
    actions,
    notify,
    projectNoteState.deleteIsFailure,
    projectNoteState.deleteIsSuccess,
    projectNoteState.isDeleteMultiple,
  ]);

  const columns: ColumnProps<ProjectNote>[] = [
    {
      title: t(ProjectNoteMessages.listScore()),
      dataIndex: 'score',
      width: 130,
      ...getColumnSorterProps('score', 0),
      ...getColumnSearchCheckboxProps(
        ['score'],
        projectNoteScores,
        undefined,
        undefined,
        async value => {
          try {
            const response = await update(value);
            if (response) {
              dispatch(
                actions.fetchProjectNotes({ projectId, params: params }),
              );
            }
          } catch (e) {
            console.log(e);
          }
        },
      ),
      render: text => (
        <NotesScoreIcon>
          {text === '1' ? (
            <LikeTwoTone twoToneColor="green" />
          ) : text === '2' ? (
            <MinusCircleTwoTone twoToneColor="grey" />
          ) : text === '3' ? (
            <DislikeTwoTone twoToneColor="red" />
          ) : (
            ''
          )}
        </NotesScoreIcon>
      ),
    },
    {
      title: t(ProjectNoteMessages.listType()),
      dataIndex: 'category',
      width: 200,
      ...getColumnSorterProps('category', 0),
      ...getColumnSearchInputProps(['category']),
      render: text => text.name,
    },
    {
      title: t(ProjectNoteMessages.listDate()),
      dataIndex: 'date',
      width: 140,
      ...getColumnSorterProps('date', 2),
    },
    {
      title: t(ProjectNoteMessages.listContent()),
      dataIndex: 'content',
      render: content => (
        <div dangerouslySetInnerHTML={{ __html: content }}></div>
      ),
    },
    {
      title: t(ProjectNoteMessages.listSummary()),
      dataIndex: 'summary',
      ...getColumnSorterProps('summary', 1),
      ...getColumnSearchInputProps(['summary']),
      render: text => <Title level={5}>{text}</Title>,
    },
    {
      title: <ActionIcon />,
      width: 80,
      dataIndex: 'id',
      render: (id, record: ProjectNote) => (
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
      You're about to permanently delete project note
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
      . This will also delete any references to project note.
    </>
  );

  return (
    <Wrapper>
      <Row align="middle" justify="center">
        <Col span={8}>
          <Row justify="start">
            {projectNoteState.selectedRowKeys &&
              projectNoteState.selectedRowKeys.length > 0 && (
                <Button
                  danger
                  disabled={
                    !projectNoteState?.selectedRowKeys?.length ||
                    projectNoteState?.selectedRowKeys?.length === 0
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
              {t(ProjectNoteMessages.createNoteBtn())}
            </StyledButton>
          </Row>
        </Col>
        <Col span={24}>
          <Table
            bordered
            dataSource={projectNoteState.notes}
            columns={columns}
            rowKey="id"
            loading={projectNoteState.loading}
            onChange={handleTableChange}
            scroll={{ x: 1100 }}
            rowSelection={{
              selectedRowKeys: projectNoteState.selectedRowKeys,
              onChange: handleSelectedRows,
            }}
            pagination={{
              ...projectNoteState.pagination,
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
        cancelText={t(ProjectNoteMessages.modalCancelButton())}
        okText={
          isUpdate || isCreate
            ? t(ProjectNoteMessages.modalSubmitButton())
            : t(ProjectNoteMessages.modalEditButton())
        }
        title={
          isUpdate
            ? t(ProjectNoteMessages.modalEditTitle())
            : isView
            ? t(ProjectNoteMessages.modalViewTitle())
            : t(ProjectNoteMessages.modalCreateTitle())
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

const NotesScoreIcon = styled.div`
  font-size: 20px;
  padding-bottom: 6px;
`;
