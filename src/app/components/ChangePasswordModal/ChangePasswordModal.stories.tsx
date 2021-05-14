import React from 'react';
import { Provider } from 'react-redux';

import { configureAppStore } from 'store/configureStore';
import { ChangePasswordModal } from './index';

const store = configureAppStore();

export default {
  title: 'Components/ChangePasswordModal',
  component: ChangePasswordModal,
  args: {
    isModalVisible: true,
  },
} as any;

export const Default = args => (
  <Provider store={store}>
    <ChangePasswordModal
      handleOk={() => console.log('Submitted')}
      handleCancel={() => console.log('Canceled')}
      {...args}
    />
  </Provider>
);
