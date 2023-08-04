import React from "react";
import styled from "styled-components";

import { PoolInfo } from "../../components/PoolInfo";
import { Container } from "../../components/StyledComponents";
import { usePoolsList } from "../../hooks/usePools";
import { useEthersSigner } from "../../hooks/useViemEthers";
import { useProviderTools, useWeb3 } from "../../hooks/useWeb3";

export function PoolsListScreen(): React.ReactElement {
  const tools = useProviderTools();
  const list = usePoolsList(tools);
  const signer = useEthersSigner({ chainId: 1337 });
  const { address } = useWeb3();

  return (
    <PooldContainer>
      <h3>Pools list</h3>
      <table>
        <thead>
          <tr>
            <Th>Symbol</Th>
            <Th>Available liquidity</Th>
            <Th>Your balance</Th>
            <Th>Your Will get</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {Object.values(list || {}).map((p, i) => (
            <PoolInfo pool={p} key={i} address={address} signer={signer} />
          ))}
        </tbody>
      </table>
    </PooldContainer>
  );
}

const Th = styled.th`
  padding: 0 10px;
  height: 40px;
  opacity: 0.8;
  text-align: left;
`;

const PooldContainer = styled(Container)`
  background: ${({ theme }) => theme.containerColor};
  padding: 16px;
`;
