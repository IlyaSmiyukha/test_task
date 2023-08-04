import { CHAINS } from "@gearbox-protocol/sdk";
import { providers } from "ethers";
import * as React from "react";
import { type HttpTransport } from "viem";
import {
  type PublicClient,
  type WalletClient,
  usePublicClient,
  useWalletClient,
} from "wagmi";

import { isDev } from "../config";

// feel free to remove this file if you don't use wagmi 2+ with ethers

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network),
      ),
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId });
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient],
  );
}

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new providers.Web3Provider(transport, network);
  const signer = provider.getSigner(account.address);
  return signer;
}

export function useEthersSigner() {
  const { data: walletClient } = useWalletClient({
    chainId: isDev ? CHAINS.Local : CHAINS.Mainnet,
  });
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  );
}
