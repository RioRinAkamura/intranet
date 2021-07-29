import { Progress, Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UsersMessages } from '../../messages';

interface PropsExportState {
  success: number;
  fails: number;
  percent: number;
  failsPercent: number;
  successPercent: number;
}
export default function ExportState({
  success,
  fails,
  percent,
  failsPercent,
  successPercent,
}: PropsExportState) {
  const { t } = useTranslation();
  return (
    <div>
      <b>
        {percent === 100
          ? `${t(UsersMessages.exportCSVMessageSuccess())}`
          : `${t(UsersMessages.exportCSVMessageRequest())}`}
      </b>
      <Tooltip title={success + ' Success and ' + fails + ' Failed'}>
        <Progress
          percent={percent}
          success={{ percent: successPercent }}
          status={failsPercent === 100 ? 'exception' : 'normal'}
          strokeColor={fails > 0 ? 'red' : 'green'}
        />
      </Tooltip>
    </div>
  );
}
