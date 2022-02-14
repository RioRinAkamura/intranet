import { message, Select, SelectProps } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { messages } from './messages';
import { useGetUsers } from './useGetUsers';

const { Option } = Select;

interface Props {
  value?: string[];
  enableSearch?: boolean;
  selectProps?: SelectProps<SelectValue>;
  isView?: boolean;
  placeholder?: string;
  className?: string;
  type?: string;
  callback: (e) => void;
}

export const PhoneNumber = memo((props: Props) => {
  const { value, selectProps, isView, className, callback } = props;

  const { userList } = useGetUsers(!isView);
  const { t } = useTranslation();

  const handleOnChangeTags = value => {
    if (value.length < 1) {
      message.warning(t(messages.phoneInputValidate()));
    }
    callback(value);
  };

  return (
    <WrapperSelect
      showSearch
      showArrow={false}
      {...(isView ? selectProps : {})}
      placeholder={`${t(messages.phoneInputSearchSkills())}`}
      onChange={handleOnChangeTags}
      className={className}
      value={value}
    >
      {userList &&
        userList.map(employee => (
          <Option key={employee.id} value={employee.phone}>
            {employee.phone}
          </Option>
        ))}
    </WrapperSelect>
  );
});

const WrapperSelect = styled(Select)`
  display: block;
  margin-bottom: 10px;
  span {
    align-items: center;
  }

  .ant-select-selection-overflow {
    align-content: start;
    width: 280px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;
