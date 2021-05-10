import * as React from 'react';
import { render } from '@testing-library/react';

import { TagComponent } from '..';

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

describe('<Tags  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<TagComponent />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
