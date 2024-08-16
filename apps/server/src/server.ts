import fs from 'node:fs/promises';

import { printSchema } from 'graphql';
import mongoose from 'mongoose';

import { schema } from '@graphql/schema';

import { app } from '@app';
import { env } from '@env';

async function run() {
  await mongoose.connect(env.DATABASE_URL);

  console.log('Mongoose connected');

  app.listen(3333, () => {
    console.log(`Server is running on port http://localhost:${env.PORT}`);
    console.log(
      `GraphQL playground is running on http://localhost:${env.PORT}/playground`,
    );

    if (env.NODE_ENV === 'development') {
      fs.writeFile('src/graphql/schema.graphql', printSchema(schema));
    }
  });
}

run();
