import { mongooseLoader } from '@entria/graphql-mongoose-loader';
import DataLoader from 'dataloader';
import { model, Schema } from 'mongoose';

export interface TransactionProps {
  id: string;
  idempotenceKey: string;
  fromAccountId: Schema.Types.ObjectId;
  toAccountId: Schema.Types.ObjectId;
  amountInCents: number;
  description: string;
  createdAt: Date;
}

const transactionSchema = new Schema<TransactionProps>(
  {
    idempotenceKey: { type: String, unique: true, required: true },
    fromAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    toAccountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    amountInCents: { type: Number, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'transactions' },
);

transactionSchema.index(
  { idempotenceKey: 1, fromAccountId: 1, toAccountId: 1 },
  { unique: true },
);

export const Transaction = model<TransactionProps>('Transaction', transactionSchema);

export const TransactionLoader = new DataLoader<string, TransactionProps>((ids) => {
  return mongooseLoader(Transaction, ids, false);
});
