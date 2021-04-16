import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { changePasswordActions as actions } from '.';
import { notification } from 'antd';
import { useNotify } from 'app/components/ToastNotification';
import { ToastMessageType } from 'app/components/ToastNotification';
import { useTranslation } from 'react-i18next';
import { messages } from './../messages';

function* ChangePw(action) {
  const { notify } = useNotify();
  try {
    let status = 200;
    // let {data, status}=yield call(()=>{});
    if (status === 200) {
      notify({
        type: ToastMessageType.Info,
        message: 'Change Password Success',
        className: 'label-cancel-user',
        duration: 2,
      });
      console.log(action.payload);
    } else if (status === 404) {
      notify({
        type: ToastMessageType.Error,
        message: 'Change Password Failed',
        className: 'label-cancel-user',
        duration: 2,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

export function* Saga() {
  yield takeLatest(actions.changePassword.type, ChangePw);
}
