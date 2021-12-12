import React from 'react';
import { TFunction } from 'i18next';
import { Popover, Tooltip } from 'antd';
import { EmployeeNote } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

import { IconButton } from 'app/components/Button';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { EmployeeNoteMessages } from '../messages';

interface ActionsProps {
  t: TFunction;
  note: EmployeeNote;
  setNote: (note: EmployeeNote) => void;
  setIsView: (isView: boolean) => void;
  setIsUpdate: (isUpdate: boolean) => void;
  setIsDelete: (isUpdate: boolean) => void;
}

export const Actions: React.FC<ActionsProps> = ({
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
            <IconButton
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
            <IconButton
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
            <IconButton
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
      <IconButton shape="circle" size="small" icon={<MoreOutlined />} />
    </Popover>
  );
};
