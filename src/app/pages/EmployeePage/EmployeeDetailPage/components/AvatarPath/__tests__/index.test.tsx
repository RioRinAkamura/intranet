import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';
import { Provider } from 'react-redux';

import { AvatarPath } from '..';
import { matchMedia } from 'utils/matchMedia';
import { configureAppStore } from 'store/configureStore';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

matchMedia();

const store = configureAppStore();

const RenderAvatarPath = () => {
  const [form] = Form.useForm();
  return (
    <Provider store={store}>
      <AvatarPath isView={true} isEdit={true} form={form} />
    </Provider>
  );
};

describe('<AvatarPath  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderAvatarPath />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
