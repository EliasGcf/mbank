import mongoose, { ClientSession } from 'mongoose';

export async function transactionWithReturn<T>(
  fn: (session: ClientSession) => Promise<T>,
  options?: ClientSession['defaultTransactionOptions'],
): Promise<T> {
  const session = await mongoose.startSession();

  try {
    return await new Promise<T>((resolve, reject) => {
      let result: T;

      session
        .withTransaction(() => fn(session).then((res) => (result = res)), options)
        .then(() => resolve(result))
        .catch(reject);
    });
  } finally {
    session.endSession();
  }
}
