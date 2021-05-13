import * as React from 'react';
import { render } from '@testing-library/react';

import { RichEditor } from '..';

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

describe('<RichEditor  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RichEditor onSubmit={() => {}} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
