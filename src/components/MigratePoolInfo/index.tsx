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

import { useOracle } from "../../hooks/useOracle";

interface IProps {
  pool: PoolData;
  address?: `0x${string}`;
  signer?: Signer;
}

export function MigratePoolInfo({ pool, address }: IProps): React.ReactElement {
  const [priceinDeth, setPrice] = useState(0n);
  const { convertToEth } = useOracle();

  const { data: dToken } = useBalance({
    address: address,
    token: pool.dieselToken as `0x${string}`,
    onSuccess: data => handleConvertPrice(data),
  });

  const handleConvertPrice = async (data: any) => {
    const price = await convertToEth({
      amount: data?.value || 0n,
      tokenFrom: pool.underlyingToken,
    });
    setPrice(price ? price.toBigInt() : 0n);
  };

  return (
    <>
      <InfoItem>
        <span>Your ballance: </span>
        <span>
          {dToken ? (
            <>
              {formatBN(dToken.value, dToken.decimals)} {dToken.symbol}
            </>
          ) : (
            "-"
          )}
        </span>
      </InfoItem>
      <InfoItem>
        <span>You get: </span>
        <span>{dToken ? `${formatBN(priceinDeth, 18)} dEth` : "-"}</span>
      </InfoItem>
      <InfoItem>
        <span>Withdrawal fee:</span>
        <span>{pool.withdrawFee}</span>
      </InfoItem>
      <InfoItem>
        <span>Available Liq: </span>
        <span>
          {formatBN(
            pool.availableLiquidity,
            decimals[tokenSymbolByAddress[pool.underlyingToken]],
          )}
        </span>
      </InfoItem>
    </>
  );
}

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  justify-content: space-between;
`;
