import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { AvatarPath } from '..';
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

const RenderAvatarPath = () => {
  const [form] = Form.useForm();
  return <AvatarPath isView={true} isEdit={true} form={form} />;
};

describe('<AvatarPath  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderAvatarPath />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
