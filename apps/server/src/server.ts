import { app } from '@app';
import { env } from '@env';
import { printSchema } from 'graphql';
import fs from 'node:fs/promises';

import { schema } from '@graphql/schema';

app.listen(3333, () => {
  console.log(`Server is running on port http://localhost:${env.PORT}`);
  console.log(`GraphQL playground is running on http://localhost:${env.PORT}/playground`);

  if (env.NODE_ENV === 'development') {
    fs.writeFile('src/graphql/schema.graphql', printSchema(schema));
  }
});
