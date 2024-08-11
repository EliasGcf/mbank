import { z } from 'zod';

export const env = z
  .object({
    DATABASE_URL: z.string().url(),
    PORT: z.coerce.number().default(3333),
    JWT_SECRET: z.string(),
  })
  .parse(process.env);
