import { graphql } from 'relay-runtime';

export const transferMutation = graphql`
  mutation TransferMutation($data: TransferInput!) {
    Transfer(input: $data) {
      transaction {
        id
      }

      account {
        id
        amountInCents
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
  }
`;
