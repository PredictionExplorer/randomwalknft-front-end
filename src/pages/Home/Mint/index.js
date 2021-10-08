import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Button, Box, Typography } from "@material-ui/core";
import { ethers } from "ethers";
import axios from "axios";
import Countdown from "react-countdown";

import useStyles from "config/styles";
import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";

const Counter = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return null;
  } else {
    return (
      <Box>
        <Typography align="center" variant="h4">
          Sale opens in
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

const Mint = () => {
  const classes = useStyles();
  const history = useHistory();
  const [saleSeconds, setSaleSeconds] = useState(0);

  const { library, account } = useActiveWeb3React();

  const handleMint = async () => {
    if (library && account) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        const mintPrice = await contract.getMintPrice();

        const receipt = await contract
          .mint({ value: mintPrice })
          .then((tx) => tx.wait());

        const token_id = receipt.events[0].args.tokenId.toNumber();

        await axios.post("https://randomwalknft-api.com/tasks", {
          token_id,
        });

        history.push(`/detail/${token_id}`, {
          message:
            "Media files are being generated. Please refrersh the page in a few minutes.",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Please connect your wallet on Arbitrum network");
    }
  };

  useEffect(() => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);

    const getTimes = async () => {
      let seconds = (await contract.timeUntilSale()).toNumber();
      setSaleSeconds(seconds);
    };

    getTimes();
  }, [library]);

  return (
    <Box mt={6}>
      {saleSeconds > 0 && (
        <Countdown date={Date.now() + saleSeconds * 1000} render={Counter} />
      )}
      <Button
        onClick={handleMint}
        variant="contained"
        color="secondary"
        size="large"
        className={classes.viewButton}
      >
        Mint Now
      </Button>
    </Box>
  );
};

export default Mint;
