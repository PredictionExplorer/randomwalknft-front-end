import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

import useStyles from "config/styles";
import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";

const SalesCard = (props) => {
  const classes = useStyles();
  const { title, onMintNow } = props;
  return (
    <Card className={classes.salesCard}>
      <CardContent>
        <Box mb={1} className={classes.salesTitle}>
          <Typography color="textSecondary" align="center" variant="h6">
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" align="center">
          .001 ETH
        </Typography>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Button className={classes.salesButton} onClick={onMintNow}>
            Mint
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const SalesSection = () => {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { library, account } = useActiveWeb3React();

  const handleClose = () => setOpen(false);

  const handleMint = async () => {
    if (library && account) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

        const mintPrice = await contract.getMintPrice();

        const receipt = await contract
          .mint({ value: mintPrice })
          .then((tx) => tx.wait());

        const tokenId = receipt.events[0].args.tokenId.toNumber();

        setOpen(true);
        setMessage("Generating Random Walk NFT image...");
        axios
          .get(
            `https://hbtk5s7xeb.execute-api.us-east-2.amazonaws.com/api?token_id=${tokenId}`
          )
          .then((res) => {
            console.log(res);
            setMessage("Random Walk NFT image has been generated.");
          })
          .catch((err) => {
            console.log(err);
            setMessage("Random Walk NFT image has been generated.");
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <Box className={classes.gridContainer}>
      <Grid
        container
        justifyContent="center"
        spacing={4}
        className={classes.salesSection}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SalesCard title="Random Walk NFT" onMintNow={handleMint} />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          href="https://opensea.io/"
          target="_blank"
          variant="contained"
          color="secondary"
          size="large"
          className={classes.viewButton}
        >
          View on OpenSea
        </Button>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        message={message}
      />
    </Box>
  );
};

export default SalesSection;
