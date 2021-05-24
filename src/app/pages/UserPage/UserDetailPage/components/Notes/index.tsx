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
import { ColumnProps } from 'antd/lib/table';
import {
  FormOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import moment from 'moment';

import { config } from 'config';
import { DialogModal } from 'app/components/DialogModal';
import { DeleteConfirmModal } from 'app/components/DeleteConfirmModal';

const DATE_FORMAT = config.DATE_FORMAT;

interface Props {}

interface Note {
  id: string;
  type: string;
  summary: string;
  date: Date;
  content: string;
  timestamp: string;
}

interface FormProps {
  form: FormInstance;
  note?: Note;
}

interface ActionsProps {
  note: Note;
}

const WrapperForm: React.FC<FormProps> = ({ form, note }) => {
  const { TextArea } = Input;

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
        <TextArea placeholder="Content" rows={4} />
      </Form.Item>
      <Form.Item name="timestamp" label="Timestamp">
        <Input size="large" placeholder="Timestamp" />
      </Form.Item>
    </Form>
  );
};

const Actions: React.FC<ActionsProps> = ({ note }) => {
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
            <Tooltip title="Edit">
              <StyledIconButton
                type="primary"
                shape="circle"
                size="small"
                icon={<EditOutlined />}
                onClick={() => setIsEdit(true)}
              />
            </Tooltip>
            <Tooltip title="Delete">
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
        cancelText="Cancel"
        okText="Save"
        title="Edit Note"
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

const columns: ColumnProps<Note>[] = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Summary',
    dataIndex: 'summary',
    key: 'summary',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    render: date => {
      return moment(date).format(`${DATE_FORMAT} hh:mm:ss`);
    },
    key: 'date',
  },
  {
    title: 'Content',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
  },
  {
    title: 'Actions',
    dataIndex: 'id',
    render: (id, record: Note) => <Actions note={record} />,
    key: 'id',
  },
];

const dataSource: Note[] = [
  {
    id: '1',
    type: 'A',
    summary: 'B',
    date: new Date(1621846284657),
    content: 'D',
    timestamp: 'E',
  },
  {
    id: '2',
    type: 'F',
    summary: 'G',
    date: new Date(1621846293152),
    content: 'H',
    timestamp: 'I',
  },
];

export const Notes = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [form] = Form.useForm();

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

      <Table dataSource={dataSource} columns={columns} />

      <DialogModal
        isOpen={isOpen}
        cancelText="Cancel"
        okText="Save"
        title="Create Note"
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
