import { CHAINS } from "@gearbox-protocol/sdk";

export const isDev = process.env.NODE_ENV !== "production";

// app
export const APP_VERSION = 2;

export const ADDRESS_PROVIDERS: Record<number, string> = {
  [CHAINS.Mainnet]: process.env.REACT_APP_ADDRESS_PROVIDER_MAINNET || "",
  [CHAINS.Goerli]: process.env.REACT_APP_ADDRESS_PROVIDER_GOERLI || "",
  [CHAINS.Local]: process.env.REACT_APP_ADDRESS_PROVIDER_MAINNET || "",
  [CHAINS.Tenderly]: process.env.REACT_APP_ADDRESS_PROVIDER_MAINNET || "",
};

export const MULTICALL_ADDRESS = process.env.REACT_APP_MULTICALL || "";

export const POOL_UPDATE_DELAY = 10 * 60 * 1000;
