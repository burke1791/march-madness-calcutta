import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable'

import { HeadingNode } from '@lexical/rich-text';
import ToolbarPlugin from './plugins/toolbarPlugin';

import './editor.css';

const editorConfig = {
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode
  ]
}

function Editor() {

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className='editor-container'>
        <ToolbarPlugin />
        <div className='editor-inner'>
          <RichTextPlugin
            contentEditable={<ContentEditable className='editor-input' />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}

export default Editor;