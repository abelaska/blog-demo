export * from '@prisma/client';
export * from './cursor';

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  errorFormat: 'colorless',
  log: [
    { level: 'info', emit: 'event' },
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' },
    // { level: 'query', emit: 'event' }
  ],
});

prisma.$on('info', ({ target, ...e }) => console.info(e));
prisma.$on('warn', ({ target, ...e }) => console.warn(e));
prisma.$on('error', ({ target, ...e }) => console.error(e));
// prisma.$on('query', ({ target, ...e }) => console.debug(e));
