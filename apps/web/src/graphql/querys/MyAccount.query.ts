import { graphql } from 'relay-runtime';

export const myAccountQuery = graphql`
  query MyAccountQuery {
    account {
      id
      name
      email
      amountInCents
    }
  }
`;
