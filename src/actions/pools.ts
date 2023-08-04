import {
  IDataCompressor,
  PoolData,
  PoolService__factory,
} from "@gearbox-protocol/sdk";
import { Signer } from "ethers";

// get pools info
interface GetListProps {
  dataCompressor: IDataCompressor;
}
export type PoolsList = Record<string, PoolData>;
export const getList = async ({ dataCompressor }: GetListProps) => {
  try {
    const poolsPayload = await dataCompressor.getPoolsList();

    const result = poolsPayload.reduce<Record<string, PoolData>>((acc, p) => {
      acc[p.addr.toLowerCase()] = new PoolData(p);
      return acc;
    }, {});

    return result;
  } catch (e: any) {
    console.error(e);
    return undefined;
  }
};

// connect to pool services
interface IConnectToPool {
  address: string;
  signer: Signer;
}
export const connectToPool = async ({ address, signer }: IConnectToPool) => {
  try {
    const poolService = await PoolService__factory.connect(address, signer);
    return poolService;
  } catch (e: any) {
    console.error(e);
  }
};

interface IAddLiquidity extends IConnectToPool {
  amount: bigint;
  userAddress: string;
}

export const addLiquidity = async ({
  address,
  signer,
  amount,
  userAddress,
}: IAddLiquidity) => {
  try {
    const pool = await connectToPool({ address, signer });
    const tx = pool?.addLiquidity(amount, userAddress, 0);
    return tx;
  } catch (e: any) {
    console.error(e);
  }
};

export const removeLiquidity = async ({
  address,
  signer,
  amount,
  userAddress,
}: IAddLiquidity) => {
  try {
    const pool = await connectToPool({ address, signer });
    const tx = pool?.removeLiquidity(amount, userAddress);
    return tx;
  } catch (e: any) {
    console.error(e);
  }
};
