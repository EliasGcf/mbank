/**
 * @generated SignedSource<<be2c4f00b2e436cce11b3e9e85e1ec50>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TransactionsQuery$variables = Record<PropertyKey, never>;
export type TransactionsQuery$data = {
  readonly account: {
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
};
export type TransactionsQuery = {
  response: TransactionsQuery$data;
  variables: TransactionsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
v2 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Account",
    "kind": "LinkedField",
    "name": "account",
    "plural": false,
    "selections": [
      (v0/*: any*/),
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
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "amountInCents",
                    "storageKey": null
                  },
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
                    "selections": (v1/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "toAccount",
                    "plural": false,
                    "selections": (v1/*: any*/),
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TransactionsQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "TransactionsQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "79951c8461dd23f2e0df1858057189ec",
    "id": null,
    "metadata": {},
    "name": "TransactionsQuery",
    "operationKind": "query",
    "text": "query TransactionsQuery {\n  account {\n    id\n    transactions {\n      edges {\n        node {\n          id\n          amountInCents\n          description\n          createdAt\n          fromAccount {\n            id\n            name\n          }\n          toAccount {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "361b9a66f410905d6cb0306acbbd4c5f";

export default node;
