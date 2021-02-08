export enum BlockType {
  META = 'meta',
  TITLE = 'title',
  PARAGRAPH = 'paragraph',
}

export type Block = {
  type: BlockType;
  children: Array<{ text: string }>;
};

export type MetaBlock = Block & { id: string };

export type Document = Array<Block>;

export const EMPTY: Document = [
  { type: BlockType.TITLE, children: [{ text: '' }] },
  { type: BlockType.PARAGRAPH, children: [{ text: '' }] },
];
