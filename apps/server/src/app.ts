import cors from '@koa/cors';
import Router from '@koa/router';
import { createHandler } from 'graphql-http/lib/use/koa';
import koaPlayground from 'graphql-playground-middleware-koa';
import Koa from 'koa';

import { schema } from '@graphql/schema';

const app = new Koa();
const router = new Router();

app.use(cors());

router.get('/health', (ctx) => {
  ctx.body = 'OK';
  ctx.status = 200;
});

router.all('/playground', koaPlayground({ endpoint: '/graphql' }));
router.all(
  '/graphql',
  createHandler({
    schema,
    context: (ctx) => {
      return {
        jwt: ctx.raw.headers.authorization?.split('Bearer ')[1] ?? '',
      };
    },
  }),
);

// Add delay to all response
// app.use(async (ctx, next) => {
//   await next();
//   await new Promise((resolve) => setTimeout(resolve, 700));
// });

app.use(router.routes());
app.use(router.allowedMethods());

export { app };
