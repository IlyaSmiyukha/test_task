import {
  decimals,
  formatBN,
  PoolData,
  tokenSymbolByAddress,
} from "@gearbox-protocol/sdk";
import { Signer } from "ethers";
import React, { useState } from "react";
import styled from "styled-components";
import { useBalance } from "wagmi";

import { addLiquidity, removeLiquidity } from "../../actions/pools";
import { approveToken } from "../../actions/tokens";
import { useOracle } from "../../hooks/useOracle";
import { Button, StyledLink } from "../StyledComponents";

interface IProps {
  pool: PoolData;
  address?: `0x${string}`;
  signer?: Signer;
}

export function PoolInfo({
  pool,
  address,
  signer,
}: IProps): React.ReactElement {
  const [priceinDeth, setPrice] = useState(0n);
  const { convertToEth } = useOracle();

  const handleConvertPrice = async (data: any) => {
    const price = await convertToEth({
      amount: data.value || 0n,
      tokenFrom: pool.underlyingToken,
    });
    setPrice(price ? price.toBigInt() : 0n);
  };

  const { data: dToken, refetch } = useBalance({
    address: address,
    token: pool.dieselToken as `0x${string}`,
    onSuccess: data => handleConvertPrice(data),
  });

  const handleAddLiquedity = async () => {
    try {
      // hardcoded amount 100 uTokens
      const amount = BigInt(
        "100".padEnd(
          decimals[tokenSymbolByAddress[pool.underlyingToken]] + 3,
          "0",
        ),
      );

      const aproovetx = await approveToken({
        to: pool.address,
        signer,
        address: pool.underlyingToken,
        amount,
      });
      if (aproovetx && signer) {
        const addtx = await addLiquidity({
          address: pool.address,
          signer: signer,
          userAddress: address as string,
          amount,
        });
        if (addtx) {
          await refetch();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveLiquedity = async () => {
    try {
      if (signer && dToken) {
        const tx = await removeLiquidity({
          address: pool.address,
          signer: signer,
          amount: dToken.value,
          userAddress: address as string,
        });
        if (tx) {
          await refetch();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <tr>
      <Td>{tokenSymbolByAddress[pool.underlyingToken]}</Td>
      <Td>
        {formatBN(
          pool.availableLiquidity,
          decimals[tokenSymbolByAddress[pool.underlyingToken]],
        )}
      </Td>
      <Td>
        {dToken ? (
          <>
            {formatBN(dToken.value, dToken.decimals)} {dToken.symbol}
          </>
        ) : (
          "-"
        )}
      </Td>
      <Td>{address ? `${formatBN(priceinDeth, 18)} dWETH` : "-"}</Td>
      <Td>
        <Button onClick={handleAddLiquedity} small={1} disabled={!address}>
          Add liquidity
        </Button>
        <Button
          onClick={handleRemoveLiquedity}
          small={1}
          disabled={!address || dToken?.value === 0n}
        >
          Remove liquidity
        </Button>
        <StyledLink
          to={`/pools/${pool.address}`}
          small={1}
          accent={1}
          className={
            !address || dToken?.symbol === "dWETH" || dToken?.value === 0n
              ? "disabled"
              : ""
          }
        >
          Migrate liquidity
        </StyledLink>
      </Td>
    </tr>
  );
}

const Td = styled.td`
  padding: 0 10px;
  height: 40px;
  text-align: left;

  &:last-child {
    text-align: end;
  }
`;
