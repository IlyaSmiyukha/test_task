import { BigNumber, ethers } from "ethers";
import { Logger } from "tslog";

import { ANVIL_URL } from "./config";

export const initApp = (rpc = ANVIL_URL) => {
  const provider = new ethers.providers.JsonRpcProvider(rpc);

  const logger = new Logger({
    minLevel: "debug",
    displayFunctionName: false,
    displayLoggerName: false,
    displayFilePath: "hidden",
  });

  return { provider, logger };
};

export const impersonateAnvil = async (
  address: string,
  provider: ethers.providers.JsonRpcProvider,
) => {
  await provider.send("anvil_impersonateAccount", [address]);
  await provider.send("anvil_setBalance", [address, "0x10000000000000000000"]);
  const signer = await provider.getSigner(address);
  return signer;
};

export const toBytes32 = (bn: BigNumber) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
};

export const setStorageAt = async (
  address: string,
  index: string,
  value: string,
  provider: ethers.providers.JsonRpcProvider,
) => {
  await provider.send("anvil_setStorageAt", [address, index, value]);
  await provider.send("anvil_mine", [
    BigNumber.from(1).toHexString(),
    BigNumber.from(1).toHexString(),
  ]);
};

export const mineBlock = async (
  provider: ethers.providers.JsonRpcProvider,

  amount: BigNumber = BigNumber.from(1),
  interval: BigNumber = BigNumber.from(1),
) => {
  await provider.send("anvil_mine", [
    amount.toHexString(),
    interval.toHexString(),
  ]);
};
