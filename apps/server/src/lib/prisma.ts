import { Prisma, PrismaClient } from '@prisma/client';
import * as retry from 'retry';

export const prisma = new PrismaClient({
  omit: {
    account: {
      password: true,
      amountInCents: true,
    },
  },
});

const IGNORE_ACTIONS = [
  'findUnique',
  'findMany',
  'findFirst',
  'aggregate',
  'count',
  'findRaw',
] as const;

function retryMiddleware(): Prisma.Middleware {
  return async (params, next) => {
    const operation = retry.operation({
      retries: 4, // 1st time is not counted
      minTimeout: 100, // 100ms
      maxTimeout: 2000, // 2 seconds
      randomize: true,
      factor: 1.97, // https://www.wolframalpha.com/input?i2d=true&i=Sum%5B100*Power%5Bx%2Ck%5D%2C%7Bk%2C0%2C4%7D%5D+%3D+3+*+1000
    });

    if (~IGNORE_ACTIONS.indexOf(params.action as any)) {
      return await next(params);
    }

    return await new Promise((resolve, reject) => {
      operation.attempt(async (a) => {
        let result: any;
        let error: any = null;
        try {
          error = null;
          result = await next(params);
        } catch (e) {
          // Only handle WriteConflict issues
          if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2034') {
            error = e;
          } else {
            // This is another kind of errors, we stop retrying and reject the promise
            operation.stop();
            reject(e);
          }
        }

        // If error is null, this will be false and we can continue the execution
        if (operation.retry(error)) {
          return;
        }

        if (error) {
          reject(operation.mainError());
        } else {
          resolve(result);
        }
      });
    });
  };
}

prisma.$use(retryMiddleware());
