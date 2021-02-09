import { isDev, isProd } from '@/common/env';

test('should match env', () => {
  expect(isDev).toBeTruthy();
  expect(isProd).toBeFalsy();
});
