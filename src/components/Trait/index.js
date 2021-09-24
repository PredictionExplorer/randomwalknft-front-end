import React, { useState } from "react";
import { useHistory } from "react-router";
import { ethers } from "ethers";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
} from "@material-ui/core";

import { useActiveWeb3React } from "hooks/web3";
import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  details: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    width: "60%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  content: {
    flex: "1 0 auto",
    padding: theme.spacing(1),
  },
  cover: {
    width: "40%",
    [theme.breakpoints.down("xs")]: {
      height: 360,
      width: "100%",
    },
  },
}));

export const Trait = ({ nft }) => {
  const [address, setAddress] = useState("");
  const classes = useStyles();
  const { account, library } = useActiveWeb3React();
  const history = useHistory();
  const { seed, image, owner, id } = nft;

  const handleTransfer = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      await contract.transferFrom(account, address, id).then((tx) => tx.wait());
      history.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.cover} image={image} />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Box mb={3}>
            <Typography component="h6" variant="h6">
              Owner
            </Typography>
            <Typography
              color="secondary"
              variant="body1"
              gutterBottom
              style={{ overflowWrap: "anywhere" }}
            >
              {owner}
            </Typography>
          </Box>
          <Box mb={3}>
            <Typography variant="h6">Seed</Typography>
            <Typography
              color="secondary"
              variant="body2"
              gutterBottom
              style={{ overflowWrap: "anywhere" }}
            >
              {seed}
            </Typography>
          </Box>
          {account === nft.owner && (
            <Box>
              <Typography variant="h6">Transfer</Typography>
              <Box display="flex">
                <TextField
                  variant="filled"
                  color="secondary"
                  placeholder="Enter address here"
                  fullWidth
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={handleTransfer}
                >
                  Send
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
