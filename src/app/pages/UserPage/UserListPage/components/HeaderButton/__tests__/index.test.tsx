import * as React from 'react';
import { render } from '@testing-library/react';

import { HeaderButton } from '..';
import { matchMedia } from 'utils/matchMedia';

matchMedia();

describe('<HeaderButton  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<HeaderButton />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
