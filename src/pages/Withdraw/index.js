import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Paper,
} from "@material-ui/core";
import { ethers } from "ethers";
import Countdown from "react-countdown";

import useStyles from "config/styles";
import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";

const Counter = ({ days, hours, minutes, seconds, completed }) => {
  const counterItem = {
    width: "20%",
    padding: "8px 0",
    border: "2px solid #F4BFFF",
    boxSizing: "border-box",
    boxShadow: "0px 0px 10px #C676D7",
  };

  const padZero = (x) => x.toString().padStart(2, "0");

  if (completed) {
    return <></>;
  } else {
    return (
      <Box display="flex" justifyContent="space-between">
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(days)}
          </Typography>
          <Typography align="center" variant="body1">
            Days
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(hours)}
          </Typography>
          <Typography align="center" variant="body1">
            Hours
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(minutes)}
          </Typography>
          <Typography align="center" variant="body1">
            Minutes
          </Typography>
        </Box>
        <Box style={counterItem}>
          <Typography align="center" component="p" variant="h4" color="primary">
            {padZero(seconds)}
          </Typography>
          <Typography align="center" variant="body1">
            Seconds
          </Typography>
        </Box>
      </Box>
    );
  }
};

const Withdraw = () => {
  const classes = useStyles();
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(0);
  const [lastMinter, setLastMinter] = useState(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState(null);

  const { library, account } = useActiveWeb3React();

  const handleWithdraw = async () => {
    if (library && account) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(NFT_ADDRESS, abi, signer);

        const receipt = await contract.withdraw().then((tx) => tx.wait());

        console.log(receipt);
      } catch (err) {
        if (err.data.code === -32000) {
          alert("The withdrawal is not open yet.");
        } else {
          alert(
            "You are not the last minter, you need to mint to become the last minter"
          );
        }
      }
    } else {
      alert("Please connect your wallet on Arbitrum network");
    }
  };

  useEffect(() => {
    const contract = new ethers.Contract(NFT_ADDRESS, abi, library);

    const getData = async () => {
      const seconds = (await contract.timeUntilWithdrawal()).toNumber();
      setWithdrawalSeconds(seconds);

      const lastMinter = await contract.lastMinter();
      setLastMinter(lastMinter);

      const amount = await contract.withdrawalAmount();
      setWithdrawalAmount(
        parseFloat(ethers.utils.formatEther(amount)).toFixed(4)
      );
    };

    getData();
  }, [library]);

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>
        <Typography variant="h4" component="span">
          WITHDRAWAL
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span" color="primary">
          OPENS IN
        </Typography>
      </Typography>
      <Box mt={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6}>
            <Box mb={2}>
              {withdrawalSeconds > 0 && (
                <Countdown
                  date={Date.now() + withdrawalSeconds * 1000}
                  renderer={Counter}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box>
              <Typography variant="body1" color="primary">
                Last Minter Address
              </Typography>
              <Typography variant="body2">{lastMinter}</Typography>
            </Box>
            <Box mt={4}>
              <Typography variant="body1" color="primary">
                Withdrawal Amount
              </Typography>
              <Typography variant="body2">{withdrawalAmount} Ξ</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Paper>
        <Box my={4} p={3}>
          <Typography variant="body2" style={{ lineHeight: 2 }}>
            If somebody mints an NFT, then there is no mint for 30 days, the
            last minter can withdraw a large percentage of all the ETH that was
            spent on minting. The ETH spent on minting does not go to the
            creator of the NFT, it goes back to the minters through this
            mechanism
          </Typography>
        </Box>
      </Paper>
      <Button
        onClick={handleWithdraw}
        color="primary"
        variant="contained"
        size="large"
      >
        Withdraw Now
      </Button>
    </Container>
  );
};

export default Withdraw;
