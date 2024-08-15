import { graphql } from 'relay-runtime';

export const accountQuery = graphql`
  query AccountQuery($email: String!) {
    account(email: $email) {
      id
      name
      email
    }
  }
`;
