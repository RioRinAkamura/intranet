import * as React from 'react';
import { render } from '@testing-library/react';

import { SocialNetwork } from '..';
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

describe('<SocialNetwork  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<SocialNetwork isView={true} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
