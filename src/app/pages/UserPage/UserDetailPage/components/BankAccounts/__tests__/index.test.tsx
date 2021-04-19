import * as React from 'react';
import { render } from '@testing-library/react';

import { BankAccounts } from '..';

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

describe('<BankAccounts  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<BankAccounts />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
