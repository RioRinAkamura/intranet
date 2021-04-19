import * as React from 'react';
import { render } from '@testing-library/react';

import { SearchUsers } from '..';

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

describe('<SearchUsers  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SearchUsers />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
