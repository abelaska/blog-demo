import React, { useCallback } from 'react';
import { createEditor, Editor, Transforms, Node, Descendant, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { EMPTY, Block, BlockType } from '@/common/editor';
import { defaultPostTitle } from '@/common/post';

const Element = (props: RenderElementProps) => {
  const { attributes, children, element, ...other } = props;
  const block = element as Block;

  switch (block.type) {
    case BlockType.TITLE:
      return (
        <h2 className="mb-4 font-bold text-2xl post-title" {...attributes}>
          {children}
        </h2>
      );
    case BlockType.PARAGRAPH:
      return (
        <p className="mb-1 post-message mb-6" {...attributes}>
          {children}
        </p>
      );
    default:
      return null;
  }
};

const withLayout = <T extends Editor>(editor: T): T => {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title = {
          type: BlockType.TITLE,
          children: [{ text: defaultPostTitle }],
        };
        Transforms.insertNodes(editor, title, { at: path.concat(0) });
      }

      if (editor.children.length < 2) {
        const paragraph = {
          type: BlockType.PARAGRAPH,
          children: [{ text: '' }],
        };
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
      }

      for (const [childNode, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? BlockType.TITLE : BlockType.PARAGRAPH;
        const child = childNode as Block;

        if (SlateElement.isElement(child) && child.type !== BlockType.META && child.type !== type) {
          const newProperties: Partial<SlateElement & { type: BlockType }> = { type };
          Transforms.setNodes(editor, newProperties, { at: childPath });
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export const createPostEditor = () => withLayout(withHistory(withReact(createEditor())));

type PostEditorProps = {
  editor: ReactEditor;
  value?: Descendant[];
  className?: string;
  onChange?: (value: Descendant[]) => void;
};

export const PostEditor = ({ editor, className, onChange, value = EMPTY }: PostEditorProps) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable autoFocus spellCheck className={className} renderElement={renderElement} data-cy="editor" />
    </Slate>
  );
};

export default PostEditor;
