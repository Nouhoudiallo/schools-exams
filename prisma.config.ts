import 'dotenv/config';
import type { Prisma } from '@prisma/client'

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    //name: 'db',
   // provider: 'postgresql',
    url: process.env.DATABASE_URL ?? 'postgresql://neondb_owner:npg_HgXl9KcwNWT1@ep-noisy-field-agc0z99x-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
};
