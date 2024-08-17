import { graphql } from 'relay-runtime';

export const transactionsQuery = graphql`
  query TransactionsQuery {
    account {
      id
      transactions {
        edges {
          node {
            id
            amountInCents
            description
            createdAt
            fromAccount {
              id
              name
            }
            toAccount {
              id
              name
            }
          }
        }
      }
    }
  }
`;
