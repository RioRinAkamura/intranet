import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { DialogModal } from '..';
import { createRenderer } from 'react-test-renderer/shallow';

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

const renderer = createRenderer();

describe('<DialogModal  />', () => {
  let utils;

  it('shoud render dialog modal', () => {
    const { queryByText, getByRole } = render(
      <DialogModal okText="Submit" isOpen={true}>
        Test Modal
      </DialogModal>,
    );
    expect(getByRole('button')).toBeTruthy();
  });
});
