import * as React from 'react';
import { render } from '@testing-library/react';

import { AddBankModal } from '..';

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

describe('<AddBankModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<AddBankModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
