import { isSupportedNetwork as isSupportedNetworkSDK } from "@gearbox-protocol/sdk";
import { Connector } from "wagmi";

import { isMetamask } from "./metaMask";
import { Wallets } from "./wallets";

export const walletByConnector = (
  connector: Connector | undefined,
): Wallets | null => {
  switch (true) {
    case isMetamask(connector):
      return "metamask";
    default:
      return null;
  }
};

export const isSupportedNetwork = (
  chainId: number | undefined,
): chainId is number => isSupportedNetworkSDK(chainId);
