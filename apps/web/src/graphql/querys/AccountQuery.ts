import { graphql } from 'relay-runtime';

export const accountQuery = graphql`
  query AccountQuery($id: ID!) {
    node(id: $id) {
      ... on Account {
        id
        name
        email
        amountInCents
      }
    }
  }
`;
