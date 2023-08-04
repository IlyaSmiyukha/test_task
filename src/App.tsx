import React from "react";
import { WagmiConfig } from "wagmi";

import { client } from "./core/connectors";
import { Router } from "./screens/Router";

const CLIENT = client();

export function App(): React.ReactElement {
  return (
    <WagmiConfig config={CLIENT}>
      <Router />
    </WagmiConfig>
  );
}
