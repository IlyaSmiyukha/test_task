import {
  decimals,
  toBN,
  tokenDataByNetwork,
  tokenSymbolByAddress,
} from "@gearbox-protocol/sdk";
import { BigNumber, ethers } from "ethers";

import { initApp, mineBlock, setStorageAt, toBytes32 } from "./utils";

// probably you will need a way to manipulate balances

const ANVIL_ACCOUNT = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const TOKENS = [
  [tokenDataByNetwork.Mainnet.WETH.toLowerCase(), 3],
  [tokenDataByNetwork.Mainnet.USDC.toLowerCase(), 9],
  [tokenDataByNetwork.Mainnet.DAI.toLowerCase(), 2],
  [tokenDataByNetwork.Mainnet.WBTC.toLowerCase(), 0],
  [tokenDataByNetwork.Mainnet.FRAX.toLowerCase(), 0],
  // [tokenDataByNetwork.Mainnet.STETH.toLowerCase(), 0],
  [tokenDataByNetwork.Mainnet.wstETH.toLowerCase(), 0],
] as const;

const balance = "1000000";

async function main() {
  const { provider, logger } = initApp();
  logger.debug("String adding balances");

  await Promise.all(
    TOKENS.map(([tokenAddress, slot]) => {
      const index = ethers.utils.solidityKeccak256(
        ["uint256", "uint256"],
        [ANVIL_ACCOUNT, slot],
      );

      logger.debug("Start adding", tokenSymbolByAddress[tokenAddress]);
      return setStorageAt(
        tokenAddress,
        index.toString(),
        toBytes32(
          BigNumber.from(
            toBN(balance, decimals[tokenSymbolByAddress[tokenAddress]]),
          ),
        ).toString(),
        provider,
      );
    }),
  );

  logger.debug("Finalizing");
  await mineBlock(provider);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
