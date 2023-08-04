import { PoolData } from "@gearbox-protocol/sdk";
import React, { useState } from "react";
import styled from "styled-components";
import { useBalance, useToken } from "wagmi";

import { addLiquidity, removeLiquidity } from "../../actions/pools";
import { approveToken } from "../../actions/tokens";
import { useOracle } from "../../hooks/useOracle";
import { useTrade } from "../../hooks/useTrade";
import { useEthersSigner } from "../../hooks/useViemEthers";
import { Loader } from "../Loader";
import { Button } from "../StyledComponents";

interface IProps {
  pool: PoolData | null;
  wethPool: PoolData | null;
  address?: `0x${string}`;
}

export function MigrateButton({
  pool,
  address,
  wethPool,
}: IProps): React.ReactElement {
  const { convertToEth } = useOracle();
  const signer = useEthersSigner();
  const [loader, showLoader] = useState(false);
  const { trade } = useTrade();

  const getEthPrice = async () => {
    const price = await convertToEth({
      amount: dToken?.value || 0n,
      tokenFrom: pool ? pool.underlyingToken : "",
    });
    return price;
  };

  const { data: dToken, refetch } = useBalance({
    address: address,
    token: pool ? (pool.dieselToken as `0x${string}`) : undefined,
  });

  const { data: uToken } = useToken({
    address: pool ? (pool.underlyingToken as `0x${string}`) : undefined,
  });

  const handleRemoveLiquedity = async () => {
    if (signer && dToken && pool) {
      const reciept = await removeLiquidity({
        address: pool.address,
        signer: signer,
        amount: dToken.value,
        userAddress: address as string,
      });
      return reciept;
    }
  };

  const handleAddLiquedity = async (tradetx: string) => {
    try {
      if (signer && wethPool && tradetx !== "Failed") {
        const dEthAmount = await getEthPrice();

        const reciept = await approveToken({
          to: wethPool.address,
          signer,
          address: wethPool.underlyingToken,
        });
        if (reciept && dEthAmount) {
          await addLiquidity({
            address: wethPool.address,
            signer,
            amount: dEthAmount.toBigInt(),
            userAddress: address as string,
          });
          await refetch();
        }
      } else {
        await refetch();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleClick = async () => {
    try {
      if (pool && uToken && dToken) {
        showLoader(true);
        const removedtx = await handleRemoveLiquedity();
        if (removedtx) {
          const tradetx = await trade(uToken, dToken?.value);
          const addtx = await handleAddLiquedity(tradetx);
        }
        showLoader(false);
      }
    } catch (error) {
      showLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Mbuttin
        onClick={handleClick}
        disabled={!address || dToken?.value === 0n}
        accent={1}
      >
        Migrate
      </Mbuttin>
    </>
  );
}

const Mbuttin = styled(Button)`
  margin: 10px 0;

  &:disabled {
    &:hover {
      background: ${({ theme }) => theme.accentColor};
    }
  }
`;
