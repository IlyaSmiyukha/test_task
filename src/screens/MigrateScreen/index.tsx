import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PoolData } from "@gearbox-protocol/sdk";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";

import { MigrateButton } from "../../components/MigrateBtn";
import { MigratePoolInfo } from "../../components/MigratePoolInfo";
import { Container } from "../../components/StyledComponents";
import { Tip } from "../../components/Tip";
import { usePoolsList } from "../../hooks/usePools";
import { useProviderTools, useWeb3 } from "../../hooks/useWeb3";

export function MigrateScreen(): React.ReactElement {
  const { poolId } = useParams();
  const tools = useProviderTools();
  const list = usePoolsList(tools);
  const { address } = useWeb3();
  const [currentPool, setPool] = useState<PoolData | null>(null);
  const [wethPool, setWethPool] = useState<PoolData | null>(null);

  useEffect(() => {
    if (poolId && list) {
      setPool(list[poolId]);
      setWethPool(list["0xb03670c20f87f2169a7c4ebe35746007e9575901"]);
    }
  }, [poolId, list]);

  return (
    <MigrateContainer>
      <h3>
        <StyledLink to="/pools">
          <FontAwesomeIcon icon={faArrowLeft} />
        </StyledLink>
        Migrate liquidity
      </h3>
      <Tip />
      {currentPool && <MigratePoolInfo pool={currentPool} address={address} />}
      <MigrateButton pool={currentPool} address={address} wethPool={wethPool} />
    </MigrateContainer>
  );
}

const StyledLink = styled(Link)`
  margin-right: 40px;
  color: #fff;

  &:hover {
    color: ${({ theme }) => theme.accentColor};
  }
`;

const MigrateContainer = styled(Container)`
  background: ${({ theme }) => theme.containerColor};
  padding: 24px;
  max-width: 400px;
  border-radius: 16px;
  position: relative;
`;
