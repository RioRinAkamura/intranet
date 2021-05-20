import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { BankAccounts } from '..';
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

const RenderBankAccounts = () => {
  const [form] = Form.useForm();
  return <BankAccounts isView={true} isEdit={false} form={form} />;
};

describe('<BankAccounts  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderBankAccounts />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
