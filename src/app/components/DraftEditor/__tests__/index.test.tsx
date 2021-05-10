import * as React from 'react';
import { render } from '@testing-library/react';

import { DraftEditor } from '..';

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

describe('<DraftEditor  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<DraftEditor />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
