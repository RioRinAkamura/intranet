import * as React from 'react';
import { render } from '@testing-library/react';

import { IdCardInfo } from '..';

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

describe('<IdCardInfo  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<IdCardInfo />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
