import React, { useState } from "react";
import { useHistory } from "react-router";
import { ethers } from "ethers";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import PlayCircleIcon from "@material-ui/icons/PlayCircleFilled";
import { makeStyles } from "@material-ui/core/styles";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import { useActiveWeb3React } from "hooks/web3";
import abi from "abis/contract";
import marketABI from "abis/market";
import { MARKET_ADDRESS, CONTRACT_ADDRESS } from "constants/app";
import {
  useTokenSellOffersBy,
  useTokenSellOffers,
  useTokenBuyOffersBy,
  useTokenBuyOffers,
} from "hooks/useOffer";

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
    width: "60%",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  content: {
    flex: "1 0 auto",
    padding: theme.spacing(1),
    [theme.breakpoints.down("xs")]: {
      minHeight: "300px",
    },
  },
  coverWrapper: {
    width: "40%",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  cover: {
    width: "100%",
    paddingTop: "64%",
    borderRadius: theme.spacing(1),
  },
}));

const Market = ({ nft, account, library }) => {
  const [price, setPrice] = useState("");
  const [tokenName, setTokenName] = useState(nft.name);
  const [address, setAddress] = useState("");
  const history = useHistory();

  const sellOffers = useTokenSellOffersBy(account);
  const buyOffers = useTokenBuyOffersBy(account);
  const tokenSellOffers = useTokenSellOffers(nft.id);
  const tokenBuyOffers = useTokenBuyOffers(nft.id);

  const sellOfferId = tokenSellOffers.find((x) => sellOffers.includes(x));
  const buyOfferId = tokenBuyOffers.find((x) => buyOffers.includes(x));

  console.log(sellOfferId, buyOfferId);

  if (!account || !nft) return null;

  const { id } = nft;

  const handleSell = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);

    try {
      const approvedAll = await contract.isApprovedForAll(
        account,
        MARKET_ADDRESS
      );
      if (!approvedAll) {
        await contract
          .setApprovalForAll(MARKET_ADDRESS, true)
          .then((tx) => tx.wait());
      }
      await market
        .makeSellOffer(id, ethers.utils.parseEther(price))
        .then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

  const handleBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);

    try {
      await market.makeBuyOffer(id).then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

  const handleCancelSell = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);
    try {
      await market.cancelSellOffer(sellOfferId).then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

  const handleCancelBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);
    try {
      await market.cancelBuyOffer(buyOfferId).then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

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

  const handleSetTokenName = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      await contract.setTokenName(id, tokenName).then((tx) => tx.wait());
      history.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container spacing={4}>
      {account === nft.owner ? (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">Transfer</Typography>
            <Box display="flex">
              <TextField
                variant="filled"
                color="secondary"
                placeholder="Enter address here"
                fullWidth
                size="small"
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Trade</Typography>
            <Box display="flex">
              <TextField
                type="number"
                variant="filled"
                color="secondary"
                placeholder="Enter ETH price here"
                value={price}
                size="small"
                style={{ flex: 1 }}
                onChange={(e) => setPrice(e.target.value)}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={handleSell}
              >
                Sell
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Token Name</Typography>
            <Box display="flex">
              <TextField
                variant="filled"
                color="secondary"
                placeholder="Enter token name here"
                value={tokenName}
                size="small"
                fullWidth
                onChange={(e) => setTokenName(e.target.value)}
              />
              <Button
                color="secondary"
                variant="contained"
                onClick={handleSetTokenName}
              >
                Update
              </Button>
            </Box>
          </Grid>
        </>
      ) : (
        <Grid item xs={12} sm={6}>
          {sellOfferId !== undefined ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleCancelSell}
            >
              Cancel Sell Offer
            </Button>
          ) : buyOfferId !== undefined ? (
            <Button
              color="secondary"
              variant="contained"
              onClick={handleCancelBuy}
            >
              Cancel Buy Offer
            </Button>
          ) : nft.owner.toLowerCase() === MARKET_ADDRESS.toLowerCase() ? (
            <Button color="secondary" variant="contained" onClick={handleBuy}>
              Make Offer
            </Button>
          ) : null}
        </Grid>
      )}
    </Grid>
  );
};

export const Trait = ({ nft }) => {
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);

  const classes = useStyles();
  const { account, library } = useActiveWeb3React();

  const { seed, image, single_video, triple_video, owner } = nft;

  const handlePlay = (videoPath) => () => {
    fetch(videoPath).then((res) => {
      if (res.ok) {
        setVideoPath(videoPath);
        setOpen(true);
      } else {
        alert("Video is being generated, come back later");
      }
    });
  };

  return (
    <>
      <Card className={classes.root}>
        <div className={classes.coverWrapper}>
          <CardActionArea onClick={() => setImageOpen(true)}>
            <CardMedia className={classes.cover} image={image} />
          </CardActionArea>
          {imageOpen && (
            <Lightbox image={image} onClose={() => setImageOpen(false)} />
          )}
          <Box display="flex" justifyContent="center" p={2}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PlayCircleIcon />}
              onClick={handlePlay(single_video)}
            >
              Single
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PlayCircleIcon />}
              style={{ marginLeft: 10 }}
              onClick={handlePlay(triple_video)}
            >
              Triple
            </Button>
            <ModalVideo
              channel="custom"
              url={videoPath}
              isOpen={open}
              onClose={() => setOpen(false)}
            />
          </Box>
        </div>
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
            <Market nft={nft} account={account} library={library} />
          </CardContent>
        </div>
      </Card>
    </>
  );
};
