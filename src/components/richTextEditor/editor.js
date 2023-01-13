import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

import { HeadingNode } from '@lexical/rich-text';
import ToolbarPlugin from './plugins/toolbarPlugin';

import './editor.css';
import { $getRoot, $getSelection } from 'lexical';

const editorConfig = {
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode
  ]
}

/**
 * @typedef EditorProps
 * @property {Object} initialEditorState
 * @property {Function} onChange
 * @property {Boolean} isEditable
 */

/**
 * @component
 * @param {EditorProps} props 
 */
function Editor(props) {

  const onChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  return (
    <LexicalComposer initialConfig={{
      editable: !!props.isEditable,
      ...editorConfig,
      editorState: props.initialEditorState
    }}>
      <div className='editor-container'>
        <ToolbarPlugin />
        <div className='editor-inner'>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;