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
      }
    }
  }
`;
