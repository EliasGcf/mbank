import Koa from 'koa';
import Router from '@koa/router';
import koaPlayground from 'graphql-playground-middleware-koa';

import { createHandler } from 'graphql-http/lib/use/koa';

import { schema } from "./graphql/schema";

const app = new Koa();
const router = new Router();

router.all('/playground', koaPlayground({ endpoint: '/graphql' }));
router.all('/graphql', createHandler({ schema: schema }));


app.use(router.routes()).use(router.allowedMethods());

app.listen(3333, () => console.log('Server is running on port http://localhost:3333'));
