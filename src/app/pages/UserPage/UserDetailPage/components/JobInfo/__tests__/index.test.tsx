import * as React from 'react';
import { render } from '@testing-library/react';

import { JobInfo } from '..';

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

describe('<JobInfo  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<JobInfo />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
