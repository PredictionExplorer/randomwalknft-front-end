import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ethers } from "ethers";
import axios from "axios";

import { Grid, Button, Typography, Box } from "@material-ui/core";

import useStyles from "config/styles";
import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";
import NFT from "components/NFT";

const SalesSection = () => {
  const classes = useStyles();
  const history = useHistory();

  const [balance, setBalance] = useState(0);
  const [tokenIds, setTokenIds] = useState([-1, -1, -1]);
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
    const getBalance = async () => {
      const balance = await contract.totalSupply();
      setBalance(balance.toNumber());
    };

    getBalance();
  }, [library]);

  useEffect(() => {
    const refreshTokenIds = async () => {
      console.log("refresh token ids");
      const tokenIds = [...Array(balance).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setTokenIds(tokenIds);
    };

    if (balance > 0) {
      refreshTokenIds();
      setInterval(refreshTokenIds, 6000);
    }
  }, [balance]);

  return (
    <Box className={classes.gridContainer}>
      <Grid
        container
        justifyContent="center"
        spacing={2}
        className={classes.salesSection}
      >
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Get a Random Walk NFT at .001 Ξ
          </Typography>
        </Grid>
        {tokenIds.map((tokenId, i) => (
          <Grid key={i} item xs={12} sm={6} md={4} lg={3}>
            <NFT tokenId={tokenId} />
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
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
    </Box>
  );
};

export default SalesSection;
