import React from 'react';
import { TFunction } from 'i18next';
import { Popover, Tooltip } from 'antd';
import { ProjectNote } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';

import { IconButton } from 'app/components/Button';

import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { ProjectNoteMessages } from '../messages';

interface ActionsProps {
  t: TFunction;
  note: ProjectNote;
  setNote: (note: ProjectNote) => void;
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
          <Tooltip title={t(ProjectNoteMessages.listViewTooltip())}>
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
          <Tooltip title={t(ProjectNoteMessages.listEditTooltip())}>
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
          <Tooltip title={t(ProjectNoteMessages.listDeleteTooltip())}>
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
