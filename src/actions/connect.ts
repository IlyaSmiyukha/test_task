import {
  getNetworkType,
  IAddressProvider__factory,
  IDataCompressor__factory,
  MultiCallContract,
  PathFinder,
} from "@gearbox-protocol/sdk";
import { providers } from "ethers";

import { ADDRESS_PROVIDERS } from "../config";

export const connectProviderTools = async (
  provider: providers.Provider,
  chainId: number,
) => {
  try {
    const addressProviderMultiCall = new MultiCallContract(
      ADDRESS_PROVIDERS[chainId],
      IAddressProvider__factory.createInterface(),
      provider,
    );

    const [
      dataCompressorAddress,
      gearTokenAddress,
      wethTokenAddress,
      pathfinder,
      priceOracleAddress,
    ] = await addressProviderMultiCall.call([
      {
        method: "getDataCompressor()",
      },
      {
        method: "getGearToken()",
      },
      {
        method: "getWethToken()",
      },
      {
        method: "getLeveragedActions()",
      },
      {
        method: "getPriceOracle()",
      },
    ]);

    const dataCompressor = IDataCompressor__factory.connect(
      dataCompressorAddress,
      provider,
    );

    const pathFinder = new PathFinder(
      pathfinder,
      provider,
      getNetworkType(chainId),
    );

    return {
      dataCompressor,
      pathFinder,
    };
  } catch (e: any) {
    console.error(e);
    return undefined;
  }
};
