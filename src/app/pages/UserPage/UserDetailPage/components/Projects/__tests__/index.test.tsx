import * as React from 'react';
import { render } from '@testing-library/react';

import { Projects } from '..';

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

describe('<Projects  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<Projects />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
