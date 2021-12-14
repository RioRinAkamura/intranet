import React from 'react';
import { Col, Row } from 'antd';
import styled from 'styled-components/macro';

import Button from '../Button';
import { Wrapper } from 'styles/StyledCommon';

interface CardFormProps {
  padding?: string;
  isView: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  padding,
  isView,
  loading,
  onCancel,
  onSubmit,
  children,
}) => {
  return (
    <Wrapper padding={padding}>
      {children}

      <WrapperButton>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Button block onClick={onCancel}>
              Cancel
            </Button>
          </Col>
          <Col>
            <Button loading={loading} block type="primary" onClick={onSubmit}>
              {isView ? 'Save' : 'Submit'}
            </Button>
          </Col>
        </Row>
      </WrapperButton>
    </Wrapper>
  );
};

const WrapperButton = styled.div`
  margin-top: 3em;
  padding: 10px;
  height: 100%;
`;
