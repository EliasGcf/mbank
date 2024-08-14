/**
 * @generated SignedSource<<7019d96fd5314959d066ca56294df033>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateAccountInput = {
  clientMutationId?: string | null | undefined;
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
};
export type CreateAccountMutation$variables = {
  data: CreateAccountInput;
};
export type CreateAccountMutation$data = {
  readonly CreateAccount: {
    readonly account: {
      readonly id: string;
    } | null | undefined;
  } | null | undefined;
};
export type CreateAccountMutation = {
  response: CreateAccountMutation$data;
  variables: CreateAccountMutation$variables;
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
    "concreteType": "CreateAccountPayload",
    "kind": "LinkedField",
    "name": "CreateAccount",
    "plural": false,
    "selections": [
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
    "name": "CreateAccountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateAccountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2defdfdebfa0d876b17075d5960a255f",
    "id": null,
    "metadata": {},
    "name": "CreateAccountMutation",
    "operationKind": "mutation",
    "text": "mutation CreateAccountMutation(\n  $data: CreateAccountInput!\n) {\n  CreateAccount(input: $data) {\n    account {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c75e667f0ad7802839a51d2b442c44f8";

export default node;
