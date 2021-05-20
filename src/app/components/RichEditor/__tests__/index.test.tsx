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
  it('Renders with a className equal to the variant', () => {
    const loadingIndicator = render(<RichEditor callback={jest.fn()} />);
    expect(
      loadingIndicator.container.getElementsByClassName(
        'public-DraftEditor-content',
      ).length,
    ).toBe(1);
  });
});
