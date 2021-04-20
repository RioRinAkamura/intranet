import * as React from 'react';
import { render } from '@testing-library/react';

import ForgotPassword from '..';

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

describe('<ForgotPassword  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ForgotPassword />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
