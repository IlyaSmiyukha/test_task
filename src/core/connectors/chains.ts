import { CHAINS } from "@gearbox-protocol/sdk";
import { configureChains } from "wagmi";
import { hardhat, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const customHardhat = { ...hardhat, id: CHAINS.Local };

const CURRENT_NETWORKS = [mainnet];

export function configureWithRPC() {
  const n = [...CURRENT_NETWORKS, customHardhat];
  const r = configureChains(n, [publicProvider()]);

  return r;
}
