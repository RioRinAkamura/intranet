import * as React from 'react';
import { render } from '@testing-library/react';

import { ProfileInfo } from '..';

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

describe('<ProfileInfo  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProfileInfo />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
