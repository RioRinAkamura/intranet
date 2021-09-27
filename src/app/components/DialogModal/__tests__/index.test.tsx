import { render } from '@testing-library/react';
import * as React from 'react';
import { DialogModal } from '..';

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

describe('<DialogModal  />', () => {
  it('shoud render dialog modal', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { queryByText, getByRole } = render(
      <DialogModal okText="Submit" isOpen={true}>
        Test Modal
      </DialogModal>,
    );
    expect(getByRole('button')).toBeTruthy();
  });
});
