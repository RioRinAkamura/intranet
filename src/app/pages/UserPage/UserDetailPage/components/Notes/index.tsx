/**
 *
 * Notes
 *
 */
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
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
} from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { config } from 'config';
import { DialogModal } from 'app/components/DialogModal';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';
import { RichEditor } from 'app/components/RichEditor/Loadable';
import { useHandleDataTable } from 'app/pages/UserPage/UserListPage/useHandleDataTable';
import { useTableConfig } from 'utils/tableConfig';

import { Note } from './slice/types';
import { useNotesSlice } from './slice';
import { selectNotes, selectNotesParams } from './slice/selectors';
import { NotesMessages } from './message';

const DATE_FORMAT = config.DATE_FORMAT;

interface Props {}
interface FormProps {
  form: FormInstance;
  note?: Note;
}

interface ActionsProps {
  note: Note;
}

const WrapperForm: React.FC<FormProps> = ({ form, note }) => {
  useEffect(() => {
    if (note) {
      form.setFieldsValue({
        ...note,
        date: moment(note.date),
      });
    }
  }, [form, note]);

  return (
    <Form layout="vertical" form={form}>
      <Form.Item name="type" label="Type">
        <Input size="large" placeholder="Type" />
      </Form.Item>
      <Form.Item name="summary" label="Summary">
        <Input size="large" placeholder="Summary" />
      </Form.Item>
      <Form.Item name="date" label="Date">
        <StyledDatePicker size="large" />
      </Form.Item>
      <Form.Item name="content" label="Content">
        <RichEditor data={note?.content} width="100%" />
      </Form.Item>
    </Form>
  );
};

const Actions: React.FC<ActionsProps> = ({ note }) => {
  const { t } = useTranslation();

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleDelete = () => {
    console.log('Deleted note', note);
  };

  const descriptionDelete = <p>Do you want to delete this note?</p>;

  return (
    <>
      <Popover
        placement="bottom"
        content={() => (
          <>
            <Tooltip title={t(NotesMessages.listEditTooltip())}>
              <StyledIconButton
                type="primary"
                shape="circle"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
            <Tooltip title={t(NotesMessages.listDeleteTooltip())}>
              <StyledIconButton
                danger
                shape="circle"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => setIsDelete(true)}
              />
            </Tooltip>
          </>
        )}
      >
        <StyledButton shape="circle" size="small" icon={<MoreOutlined />} />
      </Popover>

      <DialogModal
        isOpen={isEdit}
        cancelText={t(NotesMessages.modalCancelButton())}
        okText={t(NotesMessages.modalSubmitButton())}
        title={t(NotesMessages.modalEditTitle())}
        handleCancel={() => setIsEdit(false)}
      >
        <WrapperForm form={form} note={note} />
      </DialogModal>

      <DeleteConfirmModal
        visible={isDelete}
        title={`Remove ${note.type}`}
        description={descriptionDelete}
        handleCancel={() => setIsDelete(false)}
        handleOk={handleDelete}
        answer={note.type}
      />
    </>
  );
};

export const Notes = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [form] = Form.useForm();

  const { actions } = useNotesSlice();

  const dispatch = useDispatch();

  const params = useSelector(selectNotesParams);
  const notesState = useSelector(selectNotes);

  const {
    setSelectedRows,
    setSearchText,
    resetSearch,
    setOrdering,
    setPagination,
    setFilterText,
  } = useHandleDataTable(notesState, actions);

  const {
    getColumnSorterProps,
    getColumnSearchInputProps,
    getColumnSearchTagProps,
    getColumnSearchCheckboxFromToProps,
  } = useTableConfig(notesState, NotesMessages, setFilterText);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
  ) => {
    setOrdering(sorter);
  };

  useEffect(() => {
    dispatch(actions.fetchNotes({ params }));
  }, [actions, dispatch, params]);

  const columns: ColumnProps<Note>[] = [
    {
      title: t(NotesMessages.listType()),
      dataIndex: 'type',
      ...getColumnSorterProps('type', 0),
      ...getColumnSearchInputProps(['type']),
    },
    {
      title: t(NotesMessages.listSummary()),
      dataIndex: 'summary',
      ...getColumnSorterProps('summary', 1),
      ...getColumnSearchInputProps(['summary']),
    },
    {
      title: t(NotesMessages.listDate()),
      dataIndex: 'date',
      render: date => {
        return moment(date).format(`${DATE_FORMAT} hh:mm:ss`);
      },
      ...getColumnSorterProps('date', 2),
      ...getColumnSearchInputProps(['date']),
    },
    {
      title: t(NotesMessages.listContent()),
      dataIndex: 'content',
      ...getColumnSorterProps('content', 3),
      ...getColumnSearchInputProps(['content']),
    },
    {
      title: t(NotesMessages.listActions()),
      dataIndex: 'id',
      render: (id, record: Note) => <Actions note={record} />,
    },
  ];

  return (
    <Wrapper>
      <Header>
        <StyledButton
          size="large"
          type="primary"
          icon={<FormOutlined />}
          onClick={() => setIsOpen(true)}
        >
          Create Notes
        </StyledButton>
      </Header>

      <Table
        dataSource={notesState.notes}
        columns={columns}
        rowKey="id"
        loading={notesState.loading}
        onChange={handleTableChange}
      />

      <DialogModal
        isOpen={isOpen}
        cancelText={t(NotesMessages.modalCancelButton())}
        okText={t(NotesMessages.modalSubmitButton())}
        title={t(NotesMessages.modalCreateTitle())}
        handleCancel={() => setIsOpen(false)}
      >
        <WrapperForm form={form} />
      </DialogModal>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  background-color: white;
  padding: 1rem;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.16);
  border-radius: 12px;
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
