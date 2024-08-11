import { app } from '@app';
import { env } from '@env';

app.listen(3333, () => {
  console.log(`Server is running on port http://localhost:${env.PORT}`);
  console.log(`GraphQL playground is running on http://localhost:${env.PORT}/playground`);
});
