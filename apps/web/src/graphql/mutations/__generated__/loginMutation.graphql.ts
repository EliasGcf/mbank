/**
 * @generated SignedSource<<c4c9597539047a02ddbcd52b01e70225>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type LoginInput = {
  clientMutationId?: string | null | undefined;
  email: string;
  password: string;
};
export type LoginMutation$variables = {
  data: LoginInput;
};
export type LoginMutation$data = {
  readonly Login: {
    readonly token: string;
  } | null | undefined;
};
export type LoginMutation = {
  response: LoginMutation$data;
  variables: LoginMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "data"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "data"
      }
    ],
    "concreteType": "LoginPayload",
    "kind": "LinkedField",
    "name": "Login",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "token",
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
    "name": "LoginMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LoginMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "fbe7ec67a8ccd4e58092ce68b1553bfe",
    "id": null,
    "metadata": {},
    "name": "LoginMutation",
    "operationKind": "mutation",
    "text": "mutation LoginMutation(\n  $data: LoginInput!\n) {\n  Login(input: $data) {\n    token\n  }\n}\n"
  }
};
})();

(node as any).hash = "6f98fc48416aafc6e7ca8032e50148f9";

export default node;
