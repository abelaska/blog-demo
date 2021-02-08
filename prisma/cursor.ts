import basex from 'base-x';

const bs62 = basex('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

export const cursorToString = (cursor: any): string => bs62.encode(Buffer.from(JSON.stringify(cursor)));

export const stringToCursor = <T>(cursor: string): T => {
  try {
    return JSON.parse(bs62.decode(cursor).toString());
  } catch (ignore) {
    return undefined;
  }
};
