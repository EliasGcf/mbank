/**
 * @generated SignedSource<<8346ba3e2b68701fde7a36bb3c979f0c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type TransferInput = {
  amountInCents: number;
  clientMutationId?: string | null | undefined;
  description?: string | null | undefined;
  idempotenceKey: string;
  toAccountId: string;
};
export type TransferMutation$variables = {
  data: TransferInput;
};
export type TransferMutation$data = {
  readonly Transfer: {
    readonly account: {
      readonly amountInCents: number | null | undefined;
      readonly id: string;
      readonly transactions: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly amountInCents: number;
            readonly createdAt: string;
            readonly description: string | null | undefined;
            readonly fromAccount: {
              readonly id: string;
              readonly name: string;
            };
            readonly id: string;
            readonly toAccount: {
              readonly id: string;
              readonly name: string;
            };
          } | null | undefined;
        } | null | undefined> | null | undefined;
      } | null | undefined;
    } | null | undefined;
    readonly transaction: {
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type TransferMutation = {
  response: TransferMutation$data;
  variables: TransferMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "data"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "amountInCents",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "data"
      }
    ],
    "concreteType": "TransferPayload",
    "kind": "LinkedField",
    "name": "Transfer",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Transaction",
        "kind": "LinkedField",
        "name": "transaction",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "account",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "TransactionConnection",
            "kind": "LinkedField",
            "name": "transactions",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "TransactionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Transaction",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "description",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createdAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Account",
                        "kind": "LinkedField",
                        "name": "fromAccount",
                        "plural": false,
                        "selections": (v3/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Account",
                        "kind": "LinkedField",
                        "name": "toAccount",
                        "plural": false,
                        "selections": (v3/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TransferMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TransferMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "ee53478c365adaad4fb653486a777472",
    "id": null,
    "metadata": {},
    "name": "TransferMutation",
    "operationKind": "mutation",
    "text": "mutation TransferMutation(\n  $data: TransferInput!\n) {\n  Transfer(input: $data) {\n    transaction {\n      id\n    }\n    account {\n      id\n      amountInCents\n      transactions {\n        edges {\n          node {\n            id\n            amountInCents\n            description\n            createdAt\n            fromAccount {\n              id\n              name\n            }\n            toAccount {\n              id\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6677d720d2260a034e374a3eb64b9f2f";

export default node;
