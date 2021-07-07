import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { JobInfo } from '..';
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

const RenderJobInfo = () => {
  const [form] = Form.useForm();
  return <JobInfo form={form} />;
};

describe('<JobInfo  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderJobInfo />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
