import * as React from 'react';
import { render } from '@testing-library/react';

import { ChangeLogs } from '..';

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

describe('<ChangeLogs  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ChangeLogs employeeId={'string'} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
