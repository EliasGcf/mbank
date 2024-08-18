import { z } from 'zod';

export const env = z
  .object({
    GRAPHQL_API_URL: z.string(),
    WEB_APP_URL: z.string(),
  })
  .parse({
    GRAPHQL_API_URL: import.meta.env.VITE_GRAPHQL_API_URL,
    WEB_APP_URL: import.meta.env.VITE_WEB_APP_URL,
  });
