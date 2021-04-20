import { Select, Tag } from 'antd';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { request } from 'utils/request';

interface Props {}

const data = [
  { value: '1' },
  { value: '2' },
  { value: '3' },
  { value: '4' },
  { value: '5' },
  { value: '6' },
  { value: '7' },
  { value: '8' },
  { value: '9' },
  { value: '12' },
  { value: '23' },
  { value: '33' },
  { value: 'goldzz' },
  { value: 'lime' },
  { value: 'green' },
  { value: 'cyan' },
];

const tagRender = ({ label, value, closable, onClose }) => {




  return (
    <div>
      <Tag
        color="volcano"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    </div>
  );
};

const Tags: React.FC<Props> = ({}) => {
  return (
    <Wrapper>
      <Select
        mode="multiple"
        showArrow
        tagRender={tagRender}
        defaultValue={['HTML', 'React']}
        style={{ width: '100%' }}
        options={data}
        className="tags"
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .tags {
    span.ant-tag-close-icon {
      transform: translateY(-2px);
    }
  }
`;

export default Tags;
