import { IPriceOracleV2__factory } from "@gearbox-protocol/sdk";
import { useCallback } from "react";

import { useEthersSigner } from "./useViemEthers";

// connect to pool services
interface iConvert {
  amount: bigint;
  tokenFrom: string;
}

// constants
const wETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ORACLE_ADDRESS = "0x6385892aCB085eaa24b745a712C9e682d80FF681";

export const useOracle = () => {
  const signer = useEthersSigner({ chainId: 1337 });
  const connectToOraclePool = async () => {
    try {
      if (signer) {
        const oracleService = await IPriceOracleV2__factory.connect(
          ORACLE_ADDRESS,
          signer,
        );
        return oracleService;
      }
    } catch (e: any) {
      console.error(e);
    }
  };
  const convertToEth = useCallback(
    async ({ amount, tokenFrom }: iConvert) => {
      try {
        const contract = await connectToOraclePool();
        const price = await contract?.convert(amount, tokenFrom, wETH_ADDRESS);
        return price;
      } catch (e: any) {
        console.error(e);
      }
    },
    [signer],
  );

  return {
    convertToEth,
  };
};
