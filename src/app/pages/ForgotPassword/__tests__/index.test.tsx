import * as React from 'react';
import { render } from '@testing-library/react';
import ReactHelmet from 'react-helmet-async';

import ForgotPassword from '..';
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

describe('<ForgotPassword  />', () => {
  beforeEach(() => {
    const helmet: any = {
      render: jest.fn(() => <></>),
    };
    jest.spyOn(ReactHelmet, 'Helmet').mockReturnValue(helmet);
  });
  it('should match snapshot', () => {
    const loadingIndicator = render(<ForgotPassword />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
