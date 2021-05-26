import * as React from 'react';
import { render } from '@testing-library/react';

import { HeaderButton } from '..';
import { matchMedia } from 'utils/matchMedia';

matchMedia();

describe('<HeaderButton  />', () => {
  it('should match snapshot', () => {
    const [imported, setImported] = React.useState(false);
    const loadingIndicator = render(
      <HeaderButton imported={imported} setImported={setImported} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
