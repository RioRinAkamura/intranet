import * as React from 'react';
import { render } from '@testing-library/react';
import ReactRouter from 'react-router';

import { ProjectDetailPage } from '..';
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

describe('<ProjectDetailPage  />', () => {
  beforeEach(() => {
    const location = {
      pathname: '/welcome',
      hash: '',
      search: '',
      state: '',
    };

    const history: any = {
      location: location,
      action: 'PUSH',
      length: 1,
    };
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({ id: '1' });
    jest.spyOn(ReactRouter, 'useLocation').mockReturnValue(location);
    jest.spyOn(ReactRouter, 'useHistory').mockReturnValue(history);
  });
  it('should match snapshot', () => {
    const loadingIndicator = render(<ProjectDetailPage />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
