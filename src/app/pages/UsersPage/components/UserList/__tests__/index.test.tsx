import * as React from 'react';
import { render } from '@testing-library/react';

import { UserList } from '..';

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

describe('<UserList  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<UserList />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
