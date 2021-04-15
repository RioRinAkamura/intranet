import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { changePasswordActions as actions } from '.';
import {notification} from "antd";

function* changePw(action) {
  try {
    let status = 200;
    // let {data, status}=yield call(()=>{});
    if(status === 200) {
      notification['success']({
        message: 'Change Password Success',
        duration: 2,
      });
    } else if (status === 404) {
      notification['error']({
        message: 'Change Password Failed',
        duration: 2,
      });
    }
  
  } catch (err) {
    console.log(err);
  }
  

}

export function* Saga() {
  yield takeLatest(actions.changePassword.type, changePw);
}
