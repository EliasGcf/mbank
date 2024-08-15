/**
 * @generated SignedSource<<0ee3393fdb15afd3ed86d4e787a05cf8>>
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
v2 = [
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "amountInCents",
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
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TransferMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ed6016eee8c7af6e4ac5750131bb6683",
    "id": null,
    "metadata": {},
    "name": "TransferMutation",
    "operationKind": "mutation",
    "text": "mutation TransferMutation(\n  $data: TransferInput!\n) {\n  Transfer(input: $data) {\n    transaction {\n      id\n    }\n    account {\n      id\n      amountInCents\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3dfd9c7cc78080921c438f9c3c930696";

export default node;
