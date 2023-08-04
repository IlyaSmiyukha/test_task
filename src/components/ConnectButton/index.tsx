import React from "react";
import { useConnect } from "wagmi";

import { useWeb3 } from "../../hooks/useWeb3";
import { Button } from "../StyledComponents";
export function ConnectButton(): React.ReactElement {
  const { activate, deactivate, isConnected } = useWeb3();
  const { connectors } = useConnect();

  const handleClick = () => {
    if (isConnected) {
      deactivate();
    } else {
      activate(connectors[0]);
    }
  };

  return (
    <Button onClick={handleClick}>
      {isConnected ? "Disconnect Metamask" : "Connect Metamask"}
    </Button>
  );
}
