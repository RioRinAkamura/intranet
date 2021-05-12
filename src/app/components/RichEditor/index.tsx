/**
 *
 * DraftEditor
 *
 */
import React, {
  memo,
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components/macro';
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
  RawDraftEntityRange,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { Button, Col, Row } from 'antd';
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionPluginTheme,
} from '@draft-js-plugins/mention';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkPlugin from '@draft-js-plugins/anchor';

import { MentionData } from '@draft-js-plugins/mention';
import { Avatar } from '../Avatar/Loadable';

import createToolbarPlugin, {
  Separator,
} from '@draft-js-plugins/static-toolbar';
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
} from '@draft-js-plugins/buttons';

import '@draft-js-plugins/mention/lib/plugin.css';
import '@draft-js-plugins/hashtag/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

interface Props {
  mentionSuggest?: Mention[];
  hashtag?: boolean;
  toolbar?: object;
  data?: string;
  width?: number;
  height?: number;
  onSubmit: (content: string) => void;
}

interface Mention {
  name: string;
  [key: string]: string;
}

export interface EntryComponentProps {
  className?: string;
  role: string;
  id: string;
  'aria-selected'?: boolean | 'false' | 'true';
  theme?: MentionPluginTheme;
  mention: MentionData;
  isFocused: boolean;
  searchValue?: string;
  onMouseDown(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseEnter(event: MouseEvent): void;
}

const Entry = (props: EntryComponentProps) => {
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

const hashtagPlugin = createHashtagPlugin({
  theme: { hashtag: 'hashtag' },
});
const toolbarPlugin = createToolbarPlugin({
  theme: {
    buttonStyles: {
      button: 'button',
      buttonWrapper: 'buttonWrapper',
      active: 'active',
    },
    toolbarStyles: { toolbar: 'toolbar' },
  },
});
const linkPlugin = createLinkPlugin();
const { Toolbar } = toolbarPlugin;

const getIndicesOf = (searchStr, str, caseSensitive?) => {
  let tempStr = str;
  let tempSearchStr = searchStr;
  const searchStrLen = tempSearchStr.length;
  if (searchStrLen === 0) {
    return [];
  }
  let startIndex = 0;
  let index;
  const indices: number[] = [];
  if (!caseSensitive) {
    tempStr = tempStr.toLowerCase();
    tempSearchStr = tempSearchStr.toLowerCase();
  }

  while ((index = tempStr.indexOf(tempSearchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
};

const getEntityRanges = (text, mentionName, mentionKey) => {
  const indices = getIndicesOf(mentionName, text);
  if (indices.length > 0) {
    return indices.map(offset => ({
      key: mentionKey,
      length: mentionName.length,
      offset,
    }));
  }

  return null;
};

export const RichEditor = memo((props: Props) => {
  const { mentionSuggest, width, height, data, onSubmit } = props;
  const ref = useRef<Editor>(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>(
    mentionSuggest && mentionSuggest['@'],
  );

  const [editorState, setEditorState] = useState(() => {
    if (data) {
      const markdownString = data;
      const rawData = markdownToDraft(markdownString);
      if (mentionSuggest) {
        const rawState = mentionSuggest.map((mention, index) => ({
          [`${index}`]: {
            type: 'mention',
            mutability: 'IMMUTABLE',
            data: {
              name: mention.name,
              avatar: mention.avatar,
            },
          },
        }));

        const entity = Object.assign({}, ...rawState);
        rawData.entityMap = entity;

        rawData.blocks = rawData.blocks.map(block => {
          const ranges: RawDraftEntityRange[] = [];
          mentionSuggest.forEach((mention, index) => {
            const entityRanges = getEntityRanges(
              block.text,
              '@' + mention.name,
              index,
            );
            if (entityRanges) {
              ranges.push(...entityRanges);
            }
          });

          return { ...block, entityRanges: ranges };
        });
      }
      const contentState = convertFromRaw(rawData);
      return EditorState.createWithContent(contentState);
    } else {
      return EditorState.createEmpty();
    }
  });

  const { MentionSuggestions, mentionPlugin } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@',
      supportWhitespace: true,
      mentionComponent: mentionProps => {
        return (
          <span className={mentionProps.className}>
            {mentionProps.children}
          </span>
        );
      },
    });
    const { MentionSuggestions } = mentionPlugin;
    return { MentionSuggestions, mentionPlugin };
  }, []);

  const onChange = useCallback((_editorState: EditorState) => {
    setEditorState(_editorState);
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    ({ trigger, value }: { trigger: string; value: string }) => {
      if (mentionSuggest) {
        setSuggestions(
          defaultSuggestionsFilter(
            value,
            mentionSuggest,
            trigger,
          ) as MentionData[],
        );
      }
    },
    [mentionSuggest],
  );

  const MyToolbar = memo(() => {
    return (
      <Toolbar>
        {externalProps => (
          <React.Fragment>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <Separator />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <Separator />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <BlockquoteButton {...externalProps} />
          </React.Fragment>
        )}
      </Toolbar>
    );
  });

  return (
    <Wrapper width={width} height={height}>
      <div className="editor">
        <Editor
          editorState={editorState}
          onChange={onChange}
          plugins={[
            mentionPlugin,
            hashtagPlugin,
            toolbarPlugin,
            inlineToolbarPlugin,
            linkPlugin,
          ]}
          ref={ref}
        />
        <MyToolbar />
        <InlineToolbar>
          {externalProps => (
            <React.Fragment>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <UnderlineButton {...externalProps} />
              <linkPlugin.LinkButton {...externalProps} />
            </React.Fragment>
          )}
        </InlineToolbar>
        {mentionSuggest && (
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions || []}
            onSearchChange={onSearchChange}
            onAddMention={mention => {}}
            entryComponent={Entry}
          />
        )}
      </div>
      <Button
        size="large"
        type="primary"
        onClick={() => {
          const content = editorState.getCurrentContent();
          const rawObject = convertToRaw(content);
          const markdownString = draftToMarkdown(rawObject);

          onSubmit(markdownString);
        }}
      >
        Save
      </Button>
    </Wrapper>
  );
});

type ComponentProps = {
  width?: number;
  height?: number;
};

const Wrapper = styled.div`
  .editor {
    position: relative;
    box-sizing: border-box;
    border: 1px solid #ddd;
    cursor: text;
    padding: 48px 16px 16px 16px;
    border-radius: 2px;
    margin-bottom: 2em;
    box-shadow: inset 0px 1px 8px -3px #ababab;
    background: #fefefe;
    width: ${(props: ComponentProps) =>
      props.width ? props.width + 'px' : '500px'};

    .public-DraftEditor-content {
      min-height: ${(props: ComponentProps) =>
        props.height ? props.height + 'px' : '140px'};
    }
  }

  .buttonWrapper {
    display: inline-block;
  }

  .button {
    width: 100%;
    background: #fbfbfb;
    color: #888;
    font-size: 18px;
    border: 0;
    vertical-align: bottom;
    height: 34px;

    svg {
      fill: #888;
    }

    :hover,
    :focus {
      background: #f3f3f3;
      outline: 0;
    }
  }

  .active {
    background-color: #ddd;
    color: black;
    svg {
      fill: black;
    }
  }

  .toolbar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0px 1px 3px 0px rgb(220 220 220);
    z-index: 2;
    box-sizing: border-box;
  }

  .hashtag {
    color: rgb(28, 65, 167);
    background-color: rgba(28, 65, 167, 0.1);
  }
`;
