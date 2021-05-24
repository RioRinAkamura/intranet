import * as React from 'react';
import { render } from '@testing-library/react';

import { Notes } from '..';
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

describe('<Notes  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Notes />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
