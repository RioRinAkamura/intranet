import React from 'react';
import { EntryComponentProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/Entry/Entry';
import { Col, Row } from 'antd';
import { Avatar } from 'app/components/Avatar/Loadable';

export const EntryMention = (props: EntryComponentProps) => {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;
  return (
    <div {...parentProps}>
      <Row gutter={[8, 8]} align="middle">
        <Col>
          <Avatar
            size={30}
            src={mention.avatar}
            alt={mention.name.split(' ')[0] + ' ' + mention.name.split(' ')[1]}
            name={mention.name.split(' ')[0] + ' ' + mention.name.split(' ')[1]}
          />
        </Col>
        <Col>{mention.name}</Col>
      </Row>
    </div>
  );
};
