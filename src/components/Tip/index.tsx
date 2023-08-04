import React from "react";
import styled from "styled-components";

export function Tip(): React.ReactElement {
  return (
    <TipContainer>
      <H4>Tip</H4>
      <p>
        MIgrating diesel (LP) tokens converts your position into diesel (LP)
        dETH tokens at the current rate.
      </p>
      <p>You should approve few transactions.</p>
    </TipContainer>
  );
}

const TipContainer = styled.div`
  border: solid 1px ${({ theme }) => theme.accentColor};
  padding: 10px;
  font-size: 12px;
  margin-bottom: 20px;
  border-radius: 6px;
`;

const H4 = styled.h4`
  margin: 0 0 10px;
  font-size: 14px;
`;
