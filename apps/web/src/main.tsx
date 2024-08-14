import { RelayEnvironmentProvider } from "react-relay";
import { RelayEnvironment } from "./graphql/RelayEnvironment";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { App } from "./app";

createRoot(document.getElementById("root")!).render(
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <StrictMode>
      <App />
    </StrictMode>
  </RelayEnvironmentProvider>
);
