import React from "react";
import styled from "styled-components";

import { ConnectButton } from "../ConnectButton";
import { Container } from "../StyledComponents";

export function Header(): React.ReactElement {
  return (
    <StyledHeader>
      <Container horisontal flexEnd>
        <ConnectButton />
      </Container>
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  margin-bottom: 40px;
`;
