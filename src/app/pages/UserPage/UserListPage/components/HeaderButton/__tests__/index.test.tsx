import * as React from 'react';
import { render } from '@testing-library/react';

import { HeaderButton } from '..';

describe('<HeaderButton  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<HeaderButton />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
