import { Select, Tag, SelectProps, message } from 'antd';
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import Link from 'antd/lib/typography/Link';
import { useGetUserTags } from './useGetUserTags';
import { SelectValue } from 'antd/lib/select';
import { messages } from './messages';
import { useTranslation } from 'react-i18next';
import { models } from '@hdwebsoft/intranet-api-sdk';

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

type Tags = models.hr.Tags;

export const colours = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
];

export const findColourIndex = (value: string) => {
  const nameSplit = value.split(' '),
    initials = nameSplit[0].charAt(0).toUpperCase();

  const charIndex = initials.charCodeAt(0) - 65;
  let colourIndex: number = charIndex % colours.length;

  return colourIndex;
};

export const TagsInput = memo((props: Props) => {
  const {
    value,
    selectProps,
    isView,
    placeholder,
    className,
    callback,
  } = props;
  const { tags } = useGetUserTags(!isView);
  const { t } = useTranslation();

  const handleOnChangeTags = value => {
    if (value.length > 0 && value[value.length - 1].length < 2) {
      value.pop();
      message.warning(t(messages.tagsInputValidate()));
    }
    callback(value);
  };

  return (
    <WrapperSelect
      mode="tags"
      {...(isView ? selectProps : {})}
      isView={isView}
      placeholder={
        isView ? '' : placeholder || `${t(messages.tagsInputSearchTags())}`
      }
      value={value}
      onChange={handleOnChangeTags}
      className={className}
      tagRender={props => {
        let colourIndex;
        if (props.label) {
          colourIndex = findColourIndex(props.label.toString());
        }
        return (
          <TagOption
            color={colours[colourIndex] ? colours[colourIndex] : 'blue'}
            style={{ padding: '3px 5px' }}
          >
            {props.label}
            {!isView && <Link onClick={() => props.onClose()}>x</Link>}
          </TagOption>
        );
      }}
    >
      {tags &&
        tags.map((tag: Tags) => (
          <Option key={tag.id} value={tag.name}>
            {tag.name}
          </Option>
        ))}
    </WrapperSelect>
  );
});

interface ScreenProps {
  isView?: boolean;
}

const WrapperSelect = styled(Select)<ScreenProps>`
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
    input {
      display: ${props => (props.isView ? 'none' : 'block')};
    }
  }

  #tags {
    display: ${props => (props.isView ? 'none' : 'block')};
  }
`;

const TagOption = styled(Tag)`
  padding: 6px 12px;
  margin: 5px;

  a {
    margin: 0px 2px 0px 5px !important;
    padding: 0 !important;
    color: black;
  }
`;
