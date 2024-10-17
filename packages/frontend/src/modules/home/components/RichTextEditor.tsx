import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Box, BoxProps } from '@chakra-ui/react';
import { inputTheme } from '../../../themes/inputTheme';

interface RichTextEditorProps extends BoxProps {
  editorState: EditorState;
  onEditorStateChange: (newEditorState: EditorState) => void;
  readOnly?: boolean;
  hideToolbar?: boolean;
  maxHeight?: string;
  preview?: boolean;
}

export function RichTextEditor({ 
  editorState, 
  onEditorStateChange, 
  readOnly = false, 
  hideToolbar = false, 
  maxHeight = "500px", 
  preview = false,
  ...boxProps 
}: RichTextEditorProps) {
  return (
    <Box position="relative" {...boxProps}>
      <Box
        maxHeight={preview ? maxHeight : undefined}
        overflowY={preview ? "hidden" : "auto"}
        position="relative"
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          placeholder="Be creative!"
          readOnly={readOnly}
          toolbarHidden={hideToolbar}
          toolbar={{
            options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'emoji', 'image', 'remove', 'history'],
          }}
          toolbarStyle={{
              border: '1px solid',
              borderColor: 'rgba(1,1,1,0.2)',
              borderRadius: '1.125rem',
              padding: '0.5rem',
          }}
          editorStyle={{
            ...(inputTheme.baseStyle?.field ?? {}),
            minHeight: preview ? undefined : "250px",
            maxHeight: preview ? undefined : "50vh",
            padding: '10px',
            paddingLeft: preview ? '10px' : '20px',
            border: readOnly ? 'none' :'1px solid',
            borderColor: 'rgba(1,1,1,0.2)',
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: '1rem',
            textAlign: 'left',
            borderRadius: '1.125rem',
            background: preview ? 'brand.100' : 'white',
          }}
        />
      </Box>
      {preview && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          pointerEvents="none"
          background="linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 80%, rgba(255,255,255,1) 100%)"
          zIndex="1"
        />
      )}
    </Box>
  );
}
