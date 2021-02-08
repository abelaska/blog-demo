import { Node } from 'slate';
import toSlug from 'slug';
import { BlockType, Document } from '@/common/editor';
import { shortenText } from '@/common/text';

export const defaultPostTitle = '(Untitled)';

export const maxPostTitleLength = 100;

export const maxPostExcerptLength = 100;

export const extractTitle = (value: Document) =>
  shortenText(
    value?.filter((e) => e.type === BlockType.TITLE).map((e) => e.children[0]?.text)[0] || defaultPostTitle,
    maxPostTitleLength,
  );

export const extractExcerpt = (value: Document) =>
  shortenText(
    value
      ?.filter((e) => e.type === BlockType.PARAGRAPH)
      .map((e) => Node.string(e))
      .find((e) => e) || '',
    maxPostExcerptLength,
  );

export const extractMeta = (bodyJson: string): { title: string; excerpt: string; slug: string } => {
  const body: Document = JSON.parse(bodyJson);
  const title = extractTitle(body);
  const excerpt = extractExcerpt(body);
  const seed = new Date().valueOf() % 1000000;
  const slug = toSlug(`${title}-${seed}`, {
    lower: false,
  });
  return { title, excerpt, slug };
};
