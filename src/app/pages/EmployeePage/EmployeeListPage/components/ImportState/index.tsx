import { Progress, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { UsersMessages } from '../../messages';
import { ObjErr } from '../HeaderButton';

interface PropsImportState {
  success: number;
  fails: number;
  arrErr: Array<ObjErr>;
  percent: number;
  failsPercent: number;
  successPercent: number;
}

export default function ImportState({
  success,
  fails,
  arrErr,
  percent,
  failsPercent,
  successPercent,
}: PropsImportState) {
  const { t } = useTranslation();
  return (
    <div>
      <b>
        {percent === 100
          ? `${t(UsersMessages.importCSVMessageSuccess())}`
          : `${t(UsersMessages.importCSVMessageRequest())}`}
      </b>
      <Tooltip title={success + ' Success and ' + fails + ' Failed'}>
        <Progress
          percent={percent}
          success={{ percent: successPercent }}
          status={failsPercent === 100 ? 'exception' : 'normal'}
          strokeColor={fails > 0 ? 'red' : 'green'}
        />
      </Tooltip>
      <div>
        {fails > 0 &&
          arrErr.map((item, index) => (
            <div key={index}>
              <p style={{ color: 'red' }}>{item.record}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
