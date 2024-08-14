import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
} from "relay-runtime";

const HTTP_ENDPOINT = "http://localhost:3333/graphql";

const fetchFn: FetchFunction = async (request, variables) => {
  const token = localStorage.getItem("token");

  const resp = await fetch(HTTP_ENDPOINT, {
    method: "POST",
    headers: {
      Accept:
        "application/graphql-response+json; charset=utf-8, application/json; charset=utf-8",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({
      query: request.text,
      variables,
    }),
  });

  return await resp.json();
};

function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export const RelayEnvironment = createRelayEnvironment();
