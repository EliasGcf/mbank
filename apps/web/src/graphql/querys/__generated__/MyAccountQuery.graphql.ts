/**
 * @generated SignedSource<<a5c7145d261383a2e6f5345eee77da94>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type MyAccountQuery$variables = Record<PropertyKey, never>;
export type MyAccountQuery$data = {
  readonly account: {
    readonly amountInCents: number | null | undefined;
    readonly email: string;
    readonly id: string;
    readonly name: string;
  } | null | undefined;
};
export type MyAccountQuery = {
  response: MyAccountQuery$data;
  variables: MyAccountQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Account",
    "kind": "LinkedField",
    "name": "account",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      },
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
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyAccountQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyAccountQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "cf01680131ee0d7e1ec5c5d8ce86579d",
    "id": null,
    "metadata": {},
    "name": "MyAccountQuery",
    "operationKind": "query",
    "text": "query MyAccountQuery {\n  account {\n    id\n    name\n    email\n    amountInCents\n  }\n}\n"
  }
};
})();

(node as any).hash = "2f34a28e5aa27724ab7f2dced25a225e";

export default node;
