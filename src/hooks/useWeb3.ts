import { providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Connector, useAccount, useConnect, useDisconnect } from "wagmi";

import { connectProviderTools } from "../actions/connect";
import { useEthersProvider, useEthersSigner } from "./useViemEthers";

export function useWeb3() {
  const { connector, isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const activate = useCallback(
    (c: Connector) => {
      try {
        if (connector !== c) {
          connect({ connector: c });
        } else {
          disconnect();
        }
      } catch (eo: any) {
        console.error(eo);
      }
    },
    [connector, connect, disconnect],
  );

  return {
    activate,
    deactivate: disconnect,
    isConnected,
    address,
  };
}

export function useProvider(): providers.Provider {
  const rpcProvider = useEthersProvider();
  const signer = useEthersSigner();
  const { connector } = useAccount();

  const p = useMemo(() => {
    if (!connector || !signer) return rpcProvider;
    return signer.provider;
  }, [connector, rpcProvider, signer]);

  return p;
}

export type ProviderTools = Awaited<
  ReturnType<typeof connectProviderTools>
> | null;

export function useProviderTools() {
  const provider = useProvider();

  const [tools, setTools] = useState<ProviderTools>(undefined);

  useEffect(() => {
    const syncTask = async () => {
      const { chainId: id } = await provider.getNetwork();
      const providerTools = await connectProviderTools(provider, id);
      setTools(providerTools);
    };

    syncTask().catch(() => {
      setTools(undefined);
    });
  }, [provider]);

  return tools;
}
