import * as React from 'react';
import { render } from '@testing-library/react';

import { IdCardInfo } from '..';
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

describe('<IdCardInfo  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(
      <IdCardInfo isView={true} isEdit={false} form={undefined} />,
    );
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
