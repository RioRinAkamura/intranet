import * as React from 'react';
import { render } from '@testing-library/react';

import { UserList } from '..';
import { MaritalStatus } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
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

describe('<UserList  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <UserList
        data={[
          {
            id: '1',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
            code: '123-456-789',
            email: 'johnbrown@gmail.com',
            first_name: 'Admin',
            last_name: 'Admin',
            status: MaritalStatus.SINGLE,
          },
        ]}
        isMore={false}
        loading={true}
        onDelete={jest.fn()}
        moreLoading={false}
      />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
