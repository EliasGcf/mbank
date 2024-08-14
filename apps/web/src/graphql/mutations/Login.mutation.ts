import { graphql } from "relay-runtime";

export const loginMutation = graphql`
  mutation LoginMutation($data: LoginInput!) {
    Login(input: $data) {
      token
      account {
        id
      }
    }
  }
`;
