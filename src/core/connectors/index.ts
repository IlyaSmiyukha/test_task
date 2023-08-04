import { createConfig } from "wagmi";

import { configureWithRPC } from "./chains";
import { metaMask } from "./metaMask";

export const client = () => {
  const { chains, ...rest } = configureWithRPC();

  return createConfig({
    ...rest,
    autoConnect: true,
    connectors: [metaMask(chains)],
  });
};

export * from "./chains";
export * from "./metaMask";
export * from "./utlis";
export * from "./wallets";
