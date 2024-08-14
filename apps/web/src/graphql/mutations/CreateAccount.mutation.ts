import { graphql } from "relay-runtime";

export const createAccountMutation = graphql`
  mutation CreateAccountMutation($data: CreateAccountInput!) {
    CreateAccount(input: $data) {
      account {
        id
      }
    }
  }
`;
