import React, { memo } from 'react';
import { Tag } from 'antd';
import { findColourIndex, colours } from 'app/components/Tags';

interface Props {
  tag: string;
  key: string;
}

export const TagComponent = memo((props: Props) => {
  const { tag } = props;
  const colourIndex = findColourIndex(tag);

  return (
    <Tag
      style={{ margin: 5 }}
      color={colours[colourIndex] ? colours[colourIndex] : 'geekblue'}
    >
      {tag.toUpperCase()}
    </Tag>
  );
});
