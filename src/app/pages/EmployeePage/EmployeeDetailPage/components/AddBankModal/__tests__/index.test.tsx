import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { AddBankModal } from '..';
import { matchMedia } from 'utils/matchMedia';

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

const RenderAddBankModal = () => {
  const [form] = Form.useForm();
  return <AddBankModal isView form={form} />;
};

describe('<AddBankModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderAddBankModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
