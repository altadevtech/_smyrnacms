import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import './RichTextEditor.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Digite o conteúdo...' }) => {
  const editor = useEditor({
    extensions: [
      StarterKit
      // Se quiser customizar o Link, descomente abaixo e adicione StarterKit.configure({ link: false })
      // Link.configure({ openOnClick: true })
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange && onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        spellCheck: 'true',
        placeholder: placeholder,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line
  }, [value]);

  return (
    <div className="tiptap-editor-wrapper">
      <div className="tiptap-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor?.isActive('bold') ? 'is-active' : ''}><b>B</b></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor?.isActive('italic') ? 'is-active' : ''}><i>I</i></button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor?.isActive('strike') ? 'is-active' : ''}><s>S</s></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor?.isActive('bulletList') ? 'is-active' : ''}>• Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor?.isActive('orderedList') ? 'is-active' : ''}>1. Lista</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor?.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>↺</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>↻</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;

