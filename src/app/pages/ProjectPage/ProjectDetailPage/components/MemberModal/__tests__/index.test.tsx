import * as React from 'react';
import { render } from '@testing-library/react';
import { Form } from 'antd';

import { MemberModal } from '..';
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

const RenderMemberModal = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState();
  return (
    <MemberModal
      open={open}
      setOpen={setOpen}
      selectedMember={selectedMember}
      setSelectedMember={setSelectedMember}
      form={form}
    />
  );
};

describe('<MemberModal  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<RenderMemberModal />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
