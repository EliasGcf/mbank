/**
 * @generated SignedSource<<10d0a0b0d59052f96965a0059ed29334>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AccountQuery$variables = {
  email: string;
};
export type AccountQuery$data = {
  readonly account: {
    readonly email: string;
    readonly id: string;
    readonly name: string;
  } | null | undefined;
};
export type AccountQuery = {
  response: AccountQuery$data;
  variables: AccountQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "email"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      }
    ],
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
    "name": "AccountQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AccountQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e5a14dc5729675159a65bf31c806bf28",
    "id": null,
    "metadata": {},
    "name": "AccountQuery",
    "operationKind": "query",
    "text": "query AccountQuery(\n  $email: String!\n) {\n  account(email: $email) {\n    id\n    name\n    email\n  }\n}\n"
  }
};
})();

(node as any).hash = "aeeae68b406acb020e0ca1ad9fe0291d";

export default node;
