import React, { useState, useEffect } from "react";
import { Button, Box, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import Countdown from "react-countdown";

import useStyles from "config/styles";
import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";

const Counter = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return null;
  } else {
    return (
      <Box>
        <Typography align="center" variant="h4" gutterBottom>
          Withdrawal opens in
        </Typography>
        <Box display="flex" justifyContent="center">
          <Box mx={2}>
            <Typography align="center" variant="h6">
              {days}
            </Typography>
            <Typography align="center" variant="body2">
              Days
            </Typography>
          </Box>
          <Box mx={2}>
            <Typography align="center" variant="h6">
              {hours}
            </Typography>
            <Typography align="center" variant="body2">
              Hours
            </Typography>
          </Box>
          <Box mx={2}>
            <Typography align="center" variant="h6">
              {minutes}
            </Typography>
            <Typography align="center" variant="body2">
              Minutes
            </Typography>
          </Box>
          <Box>
            <Typography align="center" variant="h6">
              {seconds}
            </Typography>
            <Typography align="center" variant="body2">
              Seconds
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
};

const Withdrawal = () => {
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
    <Box mt={6} display="flex" flexDirection="column" alignItems="center">
      <Box mb={2}>
        {withdrawalSeconds > 0 && (
          <Countdown
            date={Date.now() + withdrawalSeconds * 1000}
            renderer={Counter}
          />
        )}
      </Box>
      {lastMinter && (
        <Box mb={2}>
          <Typography align="center" variant="body2">
            Last Minter Address
          </Typography>
          <Typography align="center" variant="body1" color="secondary">
            {lastMinter}
          </Typography>
        </Box>
      )}
      {withdrawalAmount && (
        <Box mb={2}>
          <Typography align="center" variant="body2">
            Withdrawal Amount
          </Typography>
          <Typography align="center" variant="body1" color="secondary">
            {withdrawalAmount} Ξ
          </Typography>
        </Box>
      )}
      <Button
        onClick={handleWithdraw}
        variant="contained"
        color="secondary"
        size="large"
        className={classes.viewButton}
      >
        Withdraw Now
      </Button>
    </Box>
  );
};

export default Withdrawal;
