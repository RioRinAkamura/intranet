/**
 *
 * DraftEditor
 *
 */
import React, { memo, useMemo, useState } from 'react';
import styled from 'styled-components/macro';
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { draftToMarkdown, markdownToDraft } from 'markdown-draft-js';
import { Button } from 'antd';

interface Props {
  mentionSuggest?: Mention[];
  hashtag?: boolean;
  toolbar?: object;
  data?: string;
  onSubmit: (content: string) => void;
}

interface Mention {
  text: string;
  value: string;
  url: string;
}

export const DraftEditor = memo((props: Props) => {
  const { mentionSuggest, hashtag, data, onSubmit } = props;
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );

  useMemo(() => {
    if (data) {
      const markdownString = data;
      const rawData = markdownToDraft(markdownString);
      const contentState = convertFromRaw(rawData);
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [data]);

  const editorProps = {
    mention: mentionSuggest
      ? { separator: ' ', trigger: '@', suggestions: mentionSuggest }
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
        size="large"
        type="primary"
        onClick={() => {
          const rawContentState = convertToRaw(editorState.getCurrentContent());
          const hashConfig = {
            trigger: '#',
            separator: ' ',
          };
          const markup = draftToMarkdown(rawContentState, hashConfig);
          onSubmit(markup);
        }}
      >
        Save
      </Button>
    </Wrapper>
  );
});

const Wrapper = styled.div`
  .wrapper-class {
    padding: 5px;
    border: 1px solid #ccc;
    margin-bottom: 1em;
  }
  .editor-class {
    padding: 1rem;
    border: 1px solid #ccc;
    height: 150px;
  }
  .toolbar-class {
    border: 1px solid #ccc;
  }
  .rdw-mention-link {
    color: red;
    background-color: rgba(255, 0, 0, 0.1);
  }

  .rdw-hashtag-link {
  }
`;
