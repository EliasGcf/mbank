/**
 * @generated SignedSource<<c35e4aad66073230329a7b427e53330e>>
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
    readonly account: {
      readonly id: string;
    } | null | undefined;
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
      },
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
    "cacheID": "b02babe66898128abbe0aae896cbf270",
    "id": null,
    "metadata": {},
    "name": "LoginMutation",
    "operationKind": "mutation",
    "text": "mutation LoginMutation(\n  $data: LoginInput!\n) {\n  Login(input: $data) {\n    token\n    account {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4de19be29a8ba91c74e074f4556ef33b";

export default node;
