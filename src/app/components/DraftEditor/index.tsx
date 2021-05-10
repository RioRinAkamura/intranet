/**
 *
 * DraftEditor
 *
 */
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToMarkdown from 'draftjs-to-markdown';
import { Button } from 'antd';
import { TitlePath } from 'app/pages/UserPage/UserDetailPage/components/TitlePath';
import { NormalModuleReplacementPlugin } from 'webpack';

interface Props {
  mentionSuggest?: [];
  hashtag?: boolean;
  toolbar?: object;
  data?: string;
  onSubmit: (content: string) => void;
}

export const DraftEditor = memo((props: Props) => {
  const { mentionSuggest, hashtag, data, onSubmit } = props;
  const { t, i18n } = useTranslation();
  const [editorState, setEditorState] = useState(() =>
    data
      ? EditorState.createWithContent(ContentState.createFromText(data))
      : EditorState.createEmpty(),
  );
  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const hashConfig = {
    trigger: '#',
    separator: ' ',
  };
  const markup = draftToMarkdown(rawContentState, hashConfig);

  const editorProps = {
    mention: mentionSuggest
      ? { separator: '', trigger: '@', suggestions: mentionSuggest }
      : null,
    hashtag: hashtag
      ? {
          separator: ' ',
          trigger: '#',
        }
      : null,
  };
  return (
    <Wrapper>
      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        placeholder="Input something here"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        {...editorProps}
      />
      <Button
        onClick={() => {
          onSubmit(markup);
        }}
      >
        Check
      </Button>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  .wrapper-class {
    padding: 5px;
    border: 1px solid #ccc;
  }
  .editor-class {
    padding: 1rem;
    border: 1px solid #ccc;
    height: 150px;
  }
  .toolbar-class {
    border: 1px solid #ccc;
  }
`;
