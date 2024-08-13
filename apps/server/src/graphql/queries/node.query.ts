import { fromGlobalId, nodeDefinitions } from 'graphql-relay';

import { verifyRequiredJWT } from '@lib/jwt';

import { getAccountService } from '@services/get-account.service';
import { getTransactionService } from '@services/get-transaction.service';

function setType(obj: Record<string, unknown> | null, type: string) {
  if (!obj) return null;
  obj['_type'] = type;
  return obj;
}

export const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  async (globalId: string, ctx: { jwt: string }) => {
    const { id, type } = fromGlobalId(globalId);

    if (type === 'Account') {
      const jwt = verifyRequiredJWT(ctx.jwt);

      const account = await getAccountService({
        loggedInAccountId: jwt.sub,
        accountId: id,
      });

      return setType(account, 'Account');
    }

    if (type === 'Transaction') {
      const jwt = verifyRequiredJWT(ctx.jwt);

      const transaction = await getTransactionService({
        loggedInAccountId: jwt.sub,
        transactionId: id,
      });

      return setType(transaction, 'Transaction');
    }

    return null;
  },
  (obj) => obj._type,
);
