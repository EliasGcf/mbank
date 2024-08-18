import { env } from '@/env';
import { Environment, Network, RecordSource, Store, FetchFunction } from 'relay-runtime';

const fetchFn: FetchFunction = async (request, variables) => {
  const token = localStorage.getItem('token');

  const resp = await fetch(env.GRAPHQL_API_URL, {
    method: 'POST',
    headers: {
      Accept:
        'application/graphql-response+json; charset=utf-8, application/json; charset=utf-8',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  const json = await resp.json();

  if (json.errors) {
    const error = new Error(json.errors[0].message);

    if (error.message === 'Unauthorized') {
      localStorage.removeItem('token');
      window.location.reload();
    }

    throw error;
  }

  return json;
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export const RelayEnvironment = createRelayEnvironment();
