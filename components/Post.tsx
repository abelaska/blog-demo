import React from 'react';
import escapeHtml from 'escape-html';
import { Block, BlockType } from '@/common/editor';
import type { Post } from '@/prisma';

export const blockToJSX = (block: Block): JSX.Element => {
  const children = block?.children.map(({ text }) => escapeHtml(text)) || null;
  switch (block.type) {
    case BlockType.PARAGRAPH:
      return <p className="mb-6">{children}</p>;
  }
};

export const postToJSX = (post: Post): Array<JSX.Element> => JSON.parse(post.body).map(blockToJSX);
