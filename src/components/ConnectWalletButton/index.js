import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Chip, Button, MenuItem, Menu, Box } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { isMobile } from "react-device-detect";

import useStyles from "config/styles";
import { injected, walletconnect } from "connectors";
import { useActiveWeb3React } from "hooks/web3";
import { formatAddress } from "utils";

const ConnectWalletButton = ({ isMobileView }) => {
  const classes = useStyles();
  const { account, activate } = useActiveWeb3React();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleConnectWallet = useCallback(async () => {
    const connector = isMobile ? walletconnect : injected;
    await activate(connector, (err) => {
      alert("Please switch your MetaMask to Arbitrum network");
    });
  }, [activate]);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

  if (account) {
    return isMobileView ? (
      <Chip
        variant="outlined"
        color="secondary"
        label={
          <Box display="flex" alignItems="center">
            {formatAddress(account)}
          </Box>
        }
        className={classes.walletMobile}
        onClick={handleMenuOpen}
      />
    ) : (
      <>
        <Chip
          variant="outlined"
          color="secondary"
          label={
            <Box display="flex" alignItems="center">
              {formatAddress(account)} <ExpandMoreIcon />
            </Box>
          }
          className={classes.wallet}
          deleteIcon={<ExpandMoreIcon />}
          onClick={handleMenuOpen}
        />
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem style={{ minWidth: 166 }} onClick={handleMenuClose}>
            <Link className={classes.navItem} to={"/my-nfts"}>
              MY NFTS
            </Link>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Link className={classes.navItem} to={"/my-offers"}>
              MY OFFERS
            </Link>
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Button
      variant="outlined"
      color="secondary"
      size="large"
      onClick={handleConnectWallet}
      className={isMobileView ? classes.connectBtnMobile : classes.connectBtn}
    >
      Connect to wallet
    </Button>
  );
};

export default ConnectWalletButton;
