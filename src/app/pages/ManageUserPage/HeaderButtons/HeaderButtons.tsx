import { Row, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUsersManagePageSlice } from '../slice';

const Option = Select;
const userOptions = ['All', 'Active', 'InActive'];

export const HeaderButtons = () => {
  const dispatch = useDispatch();
  const { actions } = useUsersManagePageSlice();
  const [option, setOption] = useState(userOptions[1]);

  const handleUserOptionChange = value => {
    const isActive =
      value === 'Active' ? 'active' : value === 'InActive' ? 'inactive' : 'all';
    const userActive = {
      status: isActive,
      page: 1,
      limit: 20,
    };
    setOption(userOptions[value]);
    dispatch(actions.fetchUsers({ params: userActive }));
  };
  return (
    <>
      <Row justify="end">
        <Select
          defaultValue={option}
          style={{ width: 130, marginBottom: 12 }}
          onChange={handleUserOptionChange}
        >
          {userOptions.map(option => (
            <Option key={option}>{option}</Option>
          ))}
        </Select>
      </Row>
    </>
  );
};
