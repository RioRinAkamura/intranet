import React from 'react';
import styled from 'styled-components/macro';
import { Button, Col, Row } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export const HeaderButtons = () => {
  const history = useHistory();
  return (
    <>
      <Row justify="end">
        <OptionButton>
          <Button
            size="large"
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              history.push('/users/create');
            }}
          >
            Create User
          </Button>
        </OptionButton>
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