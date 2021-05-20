import * as React from 'react';
import { render } from '@testing-library/react';

import { AddMemberModal } from '..';

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

describe('<AddMemberModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<AddMemberModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
