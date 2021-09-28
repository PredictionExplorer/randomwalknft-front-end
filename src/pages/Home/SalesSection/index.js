import React from "react";
import { useHistory } from "react-router";
import { ethers } from "ethers";
import axios from "axios";

import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@material-ui/core";

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
  const classes = useStyles();
  const history = useHistory();

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

        const { data } = await axios.post("https://randomwalknft-api.com/tasks", {
          token_id,
        });

        console.log(data.task_id);
        history.push(`/detail/${token_id}`, {
          message:
            "Media files are being generated. Please refrersh the page in a few minutes.",
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
    </Box>
  );
};

export default SalesSection;
