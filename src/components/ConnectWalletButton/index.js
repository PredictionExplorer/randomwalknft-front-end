import React, { useCallback } from "react";
import { Chip, Button } from "@material-ui/core";
import { isMobile } from "react-device-detect";

import useStyles from "config/styles";
import { injected, walletconnect } from "connectors";
import { useActiveWeb3React } from "hooks/web3";
import { formatAddress } from "utils";

const ConnectWalletButton = () => {
  const classes = useStyles();
  const { account, activate } = useActiveWeb3React();

  const handleConnectWallet = useCallback(async () => {
    const connector = isMobile ? walletconnect : injected;
    await activate(connector, (err) => {
      alert("Please switch your MetaMask to Arbitrum network");
    });
  }, [activate]);

  if (account) {
    return (
      <Chip
        variant="outlined"
        color="secondary"
        label={formatAddress(account)}
        className={classes.toolbarButtons}
      />
    );
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={handleConnectWallet}
      className={classes.toolbarButtons}
    >
      Connect To Wallet
    </Button>
  );
};

export default ConnectWalletButton;
