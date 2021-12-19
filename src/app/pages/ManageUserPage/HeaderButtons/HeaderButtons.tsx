import { Col, Row, Select } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/macro';
import { useUsersManagePageSlice } from '../slice';

const Option = Select;
const userOptions = ['All', 'Active', 'InActive'];

export const HeaderButtons = () => {
  const dispatch = useDispatch();
  const { actions } = useUsersManagePageSlice();
  const [option, setOption] = useState(userOptions[0]);

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

const OptionButton = styled(Col)`
  margin-left: 1em;
  margin-bottom: 1em;

  button {
    display: flex;
    align-items: center;
  }
`;
