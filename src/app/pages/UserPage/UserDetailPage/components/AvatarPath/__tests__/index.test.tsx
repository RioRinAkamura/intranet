import * as React from 'react';
import { render } from '@testing-library/react';

import { AvatarPath } from '..';

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

describe('<AvatarPath  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<AvatarPath />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
