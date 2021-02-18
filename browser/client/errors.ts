export type ErrorCode =
  | 'SERVER_ERROR'
  | 'UNAUTHORIZED'
  | 'ACCESS_DENIED'
  | 'INVALID_PASSWORD'
  | 'INVALID_REQUEST'
  | 'POST_NOT_FOUND';

export const errorToMessage = (error: string | string[] | null, message?: string): string | null => {
  switch (error) {
    case 'SERVER_ERROR':
      return `SERVER ERROR: ${message}`;
    case 'INVALID_REQUEST':
      return 'Invalid request.';
    case 'FORBIDDEN':
      return 'Forbidden.';
    case 'ACCESS_DENIED':
      return 'Access denied.';
    case 'UNAUTHORIZED':
      return 'Unauthorized.';
    case 'INVALID_PASSWORD':
      return 'Invalid password';
    case 'POST_NOT_FOUND':
      return 'Post not found';
    default:
      return `Unknown error: ${error}`;
  }
};
