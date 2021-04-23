import * as React from 'react';
import { render } from '@testing-library/react';

import { SocialNetwork } from '..';

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

describe('<SocialNetwork  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SocialNetwork />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
