import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {
  computePoolAddress,
  FeeAmount,
  Pool,
  Route,
  SwapOptions,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { useSendTransaction } from "wagmi";

import { approveToken } from "../../actions/tokens";
import { useOracle } from "../useOracle";
import { useEthersSigner } from "../useViemEthers";
import { useWeb3 } from "../useWeb3";
import {
  MAX_FEE_PER_GAS,
  POOL_FACTORY_CONTRACT_ADDRESS,
  SWAP_ROUTER_ADDRESS,
  WETH_TOKEN,
} from "./constants";

interface TokenIn {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
}

enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}

export const useTrade = () => {
  const { address } = useWeb3();
  const signer = useEthersSigner();
  const { convertToEth } = useOracle();
  const { isSuccess, sendTransactionAsync } = useSendTransaction();

  const getPoolInfo = async (tokenIn: Token) => {
    if (!signer) {
      throw new Error("No signer");
    }

    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: tokenIn,
      tokenB: WETH_TOKEN,
      fee: FeeAmount.MEDIUM,
    });

    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      signer,
    );

    const [token0, token1, fee, tickSpacing, liquidity, slot0] =
      await Promise.all([
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.liquidity(),
        poolContract.slot0(),
      ]);

    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  };

  const createTrade = async (tokenIn: TokenIn, amount: bigint) => {
    const TOKEN_IN = new Token(
      1,
      tokenIn.address,
      tokenIn.decimals,
      tokenIn.symbol,
      tokenIn.name,
    );

    const poolInfo = await getPoolInfo(TOKEN_IN);

    const pool = new Pool(
      WETH_TOKEN,
      TOKEN_IN,
      FeeAmount.MEDIUM,
      poolInfo.sqrtPriceX96.toString(),
      poolInfo.liquidity.toString(),
      poolInfo.tick,
    );

    const swapRoute = new Route([pool], TOKEN_IN, WETH_TOKEN);
    const amountOut = await convertToEth({
      tokenFrom: tokenIn.address,
      amount,
    });

    if (!amountOut) {
      return null;
    }

    const uncheckedTrade = Trade.createUncheckedTrade({
      route: swapRoute,
      inputAmount: CurrencyAmount.fromRawAmount(TOKEN_IN, amount.toString()),
      outputAmount: CurrencyAmount.fromRawAmount(
        WETH_TOKEN,
        amountOut.toString(),
      ),
      tradeType: TradeType.EXACT_INPUT,
    });
    return uncheckedTrade;
  };

  const trade = async (tokenIn: TokenIn, amount: bigint) => {
    if (!address || !signer) {
      return TransactionState.Failed;
    }
    const trade = await createTrade(tokenIn, amount);

    if (!trade) {
      return TransactionState.Failed;
    }

    const tokenApproval = await approveToken({
      signer,
      to: SWAP_ROUTER_ADDRESS,
      address: tokenIn.address,
    });

    if (!tokenApproval) {
      return TransactionState.Failed;
    }

    const options: SwapOptions = {
      slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
      deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
      recipient: address,
    };
    const methodParameters = SwapRouter.swapCallParameters(trade, options);

    const tx = {
      data: methodParameters.calldata as `0x${string}`,
      to: SWAP_ROUTER_ADDRESS as `0x${string}`,
      value: amount,
      from: address as `0x${string}`,
      maxFeePerGas: MAX_FEE_PER_GAS,
      maxPriorityFeePerGas: MAX_FEE_PER_GAS,
    };

    await sendTransactionAsync(tx);
    return isSuccess ? TransactionState.Failed : TransactionState.Sent;
  };

  return {
    trade,
  };
};
