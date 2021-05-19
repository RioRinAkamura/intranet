import * as React from 'react';
import { render } from '@testing-library/react';

import { RichEditor } from '..';
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

describe('<RichEditor  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RichEditor onSubmit={jest.fn()} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
