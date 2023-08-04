import { Chain } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

export const metaMask = (chains: Array<Chain>) =>
  new MetaMaskConnector({ chains });

export function isMetamask(c: unknown): c is MetaMaskConnector {
  return c instanceof MetaMaskConnector;
}
