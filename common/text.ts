import truncate from 'truncate-utf8-bytes';

const splitter = (text: string, separator: string): string[] => {
  const result = [];
  const parts = text.split(separator);
  for (let i = 0; i < parts.length; i++) {
    if (result.length) {
      result.push(separator);
    }
    result.push(parts[i]);
  }
  return result;
};

export const shortenText = (text: string, maxLen: number): string => {
  if (!text) {
    return text;
  }

  const truncated = truncate(text, maxLen - 1);
  if (truncated === text) {
    return truncated;
  }

  const parts = splitter(text, ' ')
    .map((t) => splitter(t, '\t'))
    .reduce((r, v) => r.concat(v), []);

  parts.pop();

  return `${parts.join('').trim()}…`;
};
