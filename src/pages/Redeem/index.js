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
import moment from "moment";

import Countdown from "react-countdown";
import Counter from "components/Counter";

import useStyles from "config/styles";
import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";

const Redeem = () => {
  const classes = useStyles();
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
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

      console.log(seconds);

      const lastMinter = await contract.lastMinter();
      setLastMinter(lastMinter);

      const amount = await contract.withdrawalAmount();
      setWithdrawalAmount(
        parseFloat(ethers.utils.formatEther(amount)).toFixed(4)
      );
    };

    getData();
  }, [library]);

  if (withdrawalSeconds === null) return null;

  return (
    <Container className={classes.root}>
      {withdrawalSeconds > 0 && (
        <Typography variant="h4" className={classes.centerMobile}>
          <Typography variant="h4" component="span">
            WITHDRAWAL
          </Typography>
          &nbsp;
          <Typography variant="h4" component="span" color="primary">
            OPENS IN
          </Typography>
        </Typography>
      )}
      <Box mt={3}>
        <Grid container spacing={4}>
          {withdrawalSeconds > 0 && (
            <Grid item xs={12} sm={12} md={6}>
              <Box mb={2}>
                <Countdown
                  date={Date.now() + withdrawalSeconds * 1000}
                  renderer={Counter}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={6}>
            <Box>
              <Typography variant="body1" color="primary">
                Last Minter Address
              </Typography>
              <Typography variant="body2">{lastMinter}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body1" color="primary">
                Withdrawal Date
              </Typography>
              <Typography variant="body2">
                {moment().add(withdrawalSeconds, "seconds").format("llll")}
              </Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body1" color="primary">
                Withdrawal Amount
              </Typography>
              <Typography variant="body2">{withdrawalAmount}Ξ</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Paper>
        <Box my={4} p={3}>
          <Typography variant="body2" style={{ lineHeight: 2 }}>
            If nobody mints for 30 days after the last mint,
            last minter can withdraw 50% of all the ETH that was
            spent on minting up to that point. (ETH spent on minting does not go to the
            creators of the NFT, it goes back to the minters through this
            mechanism.)
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

export default Redeem;
