/**
 *
 * Notes
 *
 */
import React, { memo, useEffect, useState, Key } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import {
  Table,
  Button,
  Popover,
  Tooltip,
  Form,
  Input,
  DatePicker,
  FormInstance,
} from 'antd';
import { ColumnProps, TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, SorterResult } from 'antd/lib/table/interface';
import {
  FormOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { config } from 'config';
import { DialogModal } from 'app/components/DialogModal';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { useHandleDataTable } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';

import { EmployeeNote } from './slice/types';
import { useNotesSlice } from './slice';
import {
  selectEmployeeNotes,
  selectEmployeeNoteIsFilter,
  selectEmployeeNotesParams,
  selectEmployeeNoteIsSuccess,
} from './slice/selectors';
import { EmployeeNoteMessages } from './message';
import { CardLayout } from 'app/components/CardLayout';

const DATE_FORMAT = config.DATE_FORMAT;

interface Props {}
interface FormProps {
  form: FormInstance;
  note?: EmployeeNote;
  isView?: boolean;
}

interface ActionsProps {
  t: TFunction;
  note: EmployeeNote;
  setNote: (note: EmployeeNote) => void;
  setIsView: (isView: boolean) => void;
  setIsUpdate: (isUpdate: boolean) => void;
  setIsDelete: (isUpdate: boolean) => void;
}

const WrapperForm: React.FC<FormProps> = ({ form, note, isView }) => {
  useEffect(() => {
    if (note) {
      form.setFieldsValue({
        ...note,
        date: moment(note.date),
      });
    }
  }, [form, note, isView]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="type" label="Type">
        <Input size="large" placeholder="Type" disabled={isView} />
      </Form.Item>
      <Form.Item name="summary" label="Summary">
        <Input size="large" placeholder="Summary" disabled={isView} />
      </Form.Item>
      <Form.Item name="date" label="Date">
        <StyledDatePicker size="large" disabled={isView} />
      </Form.Item>
      <Form.Item name="content" label="Content">
        <RichEditor
          data={note?.content}
          width="100%"
          callback={value => {
            form.setFieldsValue({ content: value });
          }}
          isView={isView}
        />
      </Form.Item>
    </Form>
  );
};

const Actions: React.FC<ActionsProps> = ({
  t,
  note,
  setNote,
  setIsView,
  setIsUpdate,
  setIsDelete,
}) => {
  return (
    <Popover
      placement="bottom"
      content={() => (
        <>
          <Tooltip title={t(EmployeeNoteMessages.listViewTooltip())}>
            <StyledIconButton
              type="primary"
              shape="circle"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setIsView(true);
                setNote(note);
              }}
            />
          </Tooltip>
          <Tooltip title={t(EmployeeNoteMessages.listEditTooltip())}>
            <StyledIconButton
              shape="circle"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setIsUpdate(true);
                setNote(note);
              }}
            />
          </Tooltip>
          <Tooltip title={t(EmployeeNoteMessages.listDeleteTooltip())}>
            <StyledIconButton
              danger
              shape="circle"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsDelete(true);
                setNote(note);
              }}
            />
          </Tooltip>
        </>
      )}
    >
      <StyledButton shape="circle" size="small" icon={<MoreOutlined />} />
    </Popover>
  );
};

export const Notes = memo((props: Props) => {
  const { t } = useTranslation();
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isCopy, setIsCopy] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [note, setNote] = useState<EmployeeNote>();

  const [form] = Form.useForm();

  const { actions } = useNotesSlice();

  const dispatch = useDispatch();

  const { id } = useParams<Record<string, string>>();
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
        employee: id,
        date: moment(form.getFieldsValue().date).format(DATE_FORMAT),
      }),
    );
  };

  const handleNoteUpdate = () => {
    dispatch(
      actions.updateEmployeeNote({
        ...form.getFieldsValue(),
        date: moment(form.getFieldValue('date')).format(DATE_FORMAT),
        employee_id: id,
        note_id: note?.id,
      }),
    );
  };

  const handleNoteDelete = () => {
    dispatch(
      actions.deleteEmployeeNote({ employee_id: id, note_id: note?.id }),
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

  useEffect(() => {
    if (isSuccess) {
      setIsCreate(false);
      setIsUpdate(false);
      setIsDelete(false);
    }
  }, [form, isSuccess]);

  useEffect(() => {
    setNote(note);
  }, [note]);

  useEffect(() => {
    if (!isFilter) {
      dispatch(actions.fetchEmployeeNotes({ employee_id: id, params }));
    }
  }, [actions, dispatch, id, isFilter, params]);

  const columns: ColumnProps<EmployeeNote>[] = [
    {
      title: t(EmployeeNoteMessages.listType()),
      dataIndex: 'type',
      ...getColumnSorterProps('type', 0),
      ...getColumnSearchInputProps(['type']),
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
      <Header>
        <StyledButton
          size="large"
          type="primary"
          icon={<FormOutlined />}
          onClick={() => {
            setIsCreate(true);
            form.resetFields();
          }}
        >
          Create Notes
        </StyledButton>
      </Header>

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
        <WrapperForm
          form={form}
          note={!isCreate ? note : undefined}
          isView={!isCreate ? isView : false}
        />
      </DialogModal>

      <DeleteConfirmModal
        visible={isDelete}
        title={`Remove ${note?.type}`}
        description={descriptionDelete}
        handleCancel={() => setIsDelete(false)}
        handleOk={handleNoteDelete}
        answer={note?.id}
      />
    </Wrapper>
  );
});

const Wrapper = styled(CardLayout)`
  margin-top: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`;

const StyledButton = styled(Button)`
  svg {
    vertical-align: baseline;
  }
`;

const StyledIconButton = styled(StyledButton)`
  margin: 5px;
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
`;
