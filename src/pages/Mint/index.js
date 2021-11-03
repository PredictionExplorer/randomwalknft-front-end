import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  Button,
} from "@material-ui/core";
import { Fade } from "react-slideshow-image";

import abi from "abis/nft";
import pinkLineImage from "assets/pink_line.png";
import useStyles from "config/styles";
import { NFT_ADDRESS, MARKET_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";
import nftService from "services/nft";
import { formatId } from "utils";

import "react-slideshow-image/dist/styles.css";

/*
const Counter = ({ days, hours, minutes, seconds, completed }) => {
  if (completed) {
    return <></>;
  } else {
    return (
      <Box mb={2}>
        <Typography align="center" variant="h4" gutterBottom>
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
*/

const MintView = () => {
  const [saleSeconds, setSaleSeconds] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);
  const [tokenIds, setTokenIds] = useState([]);
  const [finishedCount, setFinishedCount] = useState(null);
  const [runningCount, setRunningCount] = useState(null);

  const { account, library } = useActiveWeb3React();
  const history = useHistory();
  const classes = useStyles();

  const handleMint = async () => {
    if (library && account) {
      try {
        const signer = library.getSigner();
        const contract = new ethers.Contract(NFT_ADDRESS, abi, signer);

        const mintPrice = await contract.getMintPrice();
        const newPrice = ethers.utils.formatEther(mintPrice) * 1.05;

        const receipt = await contract
          .mint({ value: ethers.utils.parseEther(newPrice.toFixed(4)) })
          .then((tx) => tx.wait());

        const token_id = receipt.events[0].args.tokenId.toNumber();

        await nftService.create(token_id);

        history.push(`/detail/${token_id}`, {
          message:
            "Media files are being generated. Please refrersh the page in a few minutes.",
        });
      } catch (err) {
        console.log(err);
        if (err.code !== 4001) {
          alert("The sale is not open yet.");
        }
      }
    } else {
      alert("Please connect your wallet on Arbitrum network");
    }
  };

  useEffect(() => {
    const contract = new ethers.Contract(NFT_ADDRESS, abi, library);
    const getData = async () => {
      const mintPrice = await contract.getMintPrice();
      setMintPrice(
        (parseFloat(ethers.utils.formatEther(mintPrice)) * 1.05).toFixed(4)
      );

      const seconds = (await contract.timeUntilSale()).toNumber();
      setSaleSeconds(seconds);

      console.log(seconds);

      const balance = await contract.totalSupply();
      const tokenIds = [...Array(balance.toNumber()).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      setTokenIds(tokenIds);

      const { finished_count, running_count } = await nftService.result();

      setFinishedCount(finished_count);
      setRunningCount(running_count);
    };

    getData();
  }, [library]);

  return (
    <Container className={classes.root}>
      {saleSeconds === 0 ? (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={7}>
            <Typography variant="h4">
              <Typography variant="h4" component="span">
                GET A
              </Typography>
              &nbsp;
              <Typography variant="h4" component="span" color="primary">
                RANDOM WALK
              </Typography>
              &nbsp;
              <Typography variant="h4" component="span">
                NFT AT
              </Typography>
              &nbsp;
              <Typography variant="h4" component="span" color="primary">
                {mintPrice}E
              </Typography>
            </Typography>
            <Box my={3}>
              <Typography variant="body1" color="secondary">
                Verified NFT Contract
              </Typography>
              <Typography variant="body2" gutterBottom>
                {NFT_ADDRESS}
              </Typography>
            </Box>
            <Box mb={3}>
              <Typography variant="body1" color="secondary">
                Verified Market Contract
              </Typography>
              <Typography variant="body2" gutterBottom>
                {MARKET_ADDRESS}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <div
                style={{
                  background: `url(${pinkLineImage}) left top`,
                  width: 64,
                  height: 8,
                }}
              ></div>
              <Button className={classes.mintActiveButton} onClick={handleMint}>
                Mint now
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={5}>
            <Fade autoplay arrows={false}>
              {tokenIds.map((id, i) => {
                const fileName = id.toString().padStart(6, "0");
                return (
                  <Card key={i} style={{ filter: "none", margin: 2 }}>
                    <CardActionArea component={Link} to={`/detail/${id}`}>
                      <CardMedia
                        className={classes.nftImage}
                        image={`https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black_thumb.jpg`}
                      />
                      <Typography
                        color="textPrimary"
                        className={classes.nftInfo}
                        variant="body1"
                      >
                        {formatId(id)}
                      </Typography>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Fade>
            {runningCount > 0 && (
              <Box mt={3}>
                <Typography variant="body2" color="textPrimary">
                  Images generated: {finishedCount}, image generation in
                  progress: {runningCount}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      ) : (
        <Box></Box>
      )}
    </Container>
  );
};

export default MintView;
