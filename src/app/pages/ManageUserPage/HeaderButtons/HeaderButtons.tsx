import { Col, Row, Select } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components/macro';

const Option = Select;
const userOptions = ['All', 'Active', 'InActive'];

export const HeaderButtons = () => {
  const [option, setOption] = useState(userOptions[1]);

  const handleUserOptionChange = value => {
    setOption(userOptions[value]);
  };
  return (
    <>
      <Row justify="end">
        <Select
          defaultValue={option}
          style={{ width: 120, marginBottom: 12 }}
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
