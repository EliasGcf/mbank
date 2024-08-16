import { Schema, model } from 'mongoose';

interface AccountProps {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  amountInCents: number;
}

const accountSchema = new Schema<AccountProps>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    amountInCents: { type: Number, default: 0, select: false },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'accounts' },
);

export const Account = model<AccountProps>('Account', accountSchema);
