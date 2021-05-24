/**
 *
 * DraftEditor
 *
 */
import React, {
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components/macro';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { Popover } from 'antd';
import createMentionPlugin, {
  MentionPluginTheme,
} from '@draft-js-plugins/mention';
import createHashtagPlugin from '@draft-js-plugins/hashtag';
import createLinkPlugin from '@draft-js-plugins/anchor';

import { MentionData } from '@draft-js-plugins/mention';

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
import 'draft-js/dist/Draft.css';

import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import { api } from 'utils/api';
import { EntryMention } from './components/EntryMention';
import { MentionContent } from './components/MentionContent';
import { mentionRemarkPlugin } from './remarkPlugin';
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

interface Props {
  toolbar?: object;
  data?: string;
  width?: string;
  height?: string;
  isView?: boolean;
  placeholder?: string;
  callback?: (content: any) => void;
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

export const RichEditor = memo((props: Props) => {
  const { width, height, data, isView, placeholder, callback } = props;
  const ref = useRef<Editor>(null);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>();
  const [editorState, setEditorState] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data) {
      const markdownString = data;
      const rawData = markdownToDraft(markdownString, {
        remarkablePlugins: [mentionRemarkPlugin],
        blockEntities: {
          mention_open: function (item: any) {
            return {
              type: 'mention',
              mutability: 'IMMUTABLE',
              data: {
                mention: {
                  id: item.id,
                  name: item.name,
                  link: item.link,
                },
              },
            };
          },
        },
      });
      const contentState = convertFromRaw(rawData);
      setEditorState(EditorState.createWithContent(contentState));
      setLoading(false);
    } else {
      setEditorState(EditorState.createEmpty());
      setLoading(false);
    }
  }, [data]);

  const { MentionSuggestions, mentionPlugin } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      mentionPrefix: '@',
      supportWhitespace: true,
      mentionComponent: mentionProps => {
        return (
          <Popover content={<MentionContent id={mentionProps.mention.id} />}>
            <span
              className={mentionProps.className}
              onClick={() => {
                window.open(
                  mentionProps.mention.link,
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
            >
              {mentionProps.children}
            </span>
          </Popover>
        );
      },
    });
    const { MentionSuggestions } = mentionPlugin;
    return { MentionSuggestions, mentionPlugin };
  }, []);

  const onChange = (_editorState: EditorState) => {
    setEditorState(_editorState);

    const content = editorState.getCurrentContent();
    const rawObject = convertToRaw(content);
    const markdownString = draftToMarkdown(rawObject, {
      entityItems: {
        mention: {
          open: function (entity: any) {
            return ``;
          },

          close: function (entity: any) {
            return `(${entity.data.mention.id})`;
          },
        },
      },
    });

    if (callback) {
      callback(markdownString);
    }
  };

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    async ({ trigger, value }: { trigger: string; value: string }) => {
      const response = await api.hr.employee.list(
        value,
        undefined,
        undefined,
        undefined,
        6,
      );
      if (response) {
        let suggest = response.results.map(response => ({
          id: response.id,
          name: response.first_name + ' ' + response.last_name,
          avatar: response.avatar,
          email: response.email,
          link: '/employees/' + response.id,
        }));
        setSuggestions(suggest);
      }
    },
    [],
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
    <Wrapper isView={isView} width={width} height={height}>
      {!loading && (
        <div className="editor">
          <Editor
            editorState={editorState}
            readOnly={isView}
            onChange={onChange}
            placeholder={placeholder}
            plugins={[
              mentionPlugin,
              hashtagPlugin,
              toolbarPlugin,
              inlineToolbarPlugin,
              linkPlugin,
            ]}
            ref={ref}
          />
          {!isView && <MyToolbar />}
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
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions || []}
            onSearchChange={onSearchChange}
            onAddMention={mention => {}}
            entryComponent={EntryMention}
          />
        </div>
      )}
    </Wrapper>
  );
});

type ComponentProps = {
  isView?: boolean;
  width?: string;
  height?: string;
};

const Wrapper = styled.div`
  .editor {
    position: relative;
    box-sizing: border-box;

    margin-bottom: 2em;
    width: ${(props: ComponentProps) => (props.width ? props.width : '500px')};

    ${(props: ComponentProps) =>
      !props.isView &&
      css`
        border: 1px solid #ddd;
        cursor: text;
        padding: 48px 16px 16px 16px;
        border-radius: 2px;
        box-shadow: inset 0px 1px 8px -3px #ababab;
        background: #fefefe;
      `}

    .public-DraftEditor-content {
      overflow: hidden;
      overflow-y: auto;
      height: ${(props: ComponentProps) =>
        props.height ? props.height : '140px'};
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
    background: #fbfbfb;
    border-radius: 2px;
    box-shadow: 0px 1px 3px 0px rgb(220 220 220);
    z-index: 2;
    box-sizing: border-box;
  }

  .hashtag {
    color: rgb(28, 65, 167);
    background-color: rgba(28, 65, 167, 0.1);
  }

  blockquote {
    margin: 1em;
  }
`;
