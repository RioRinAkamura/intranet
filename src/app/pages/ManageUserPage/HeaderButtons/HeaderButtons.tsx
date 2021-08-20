import React from 'react';
import styled from 'styled-components/macro';
import { Col, Row } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import Button from 'app/components/Button';
import { PrivatePath } from 'utils/url.const';

export const HeaderButtons = () => {
  const history = useHistory();
  return (
    <>
      <Row justify="end">
        <OptionButton>
          <Button
            type="primary"
            size="middle"
            icon={<UserAddOutlined />}
            onClick={() => {
              history.push(PrivatePath.USERS_CREATE);
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
