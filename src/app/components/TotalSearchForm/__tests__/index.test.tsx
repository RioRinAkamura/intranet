import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { TotalSearchForm } from '..';
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

const RenderTotalSearchForm = () => {
  const [form] = Form.useForm();
  return (
    <TotalSearchForm
      loading={true}
      onSearch={jest.fn()}
      onReset={jest.fn()}
      form={form}
    />
  );
};

describe('<TotalSearchForm  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderTotalSearchForm />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
