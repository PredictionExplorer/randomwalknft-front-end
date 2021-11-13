import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { ethers } from "ethers";
import {
  Box,
  Container,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Button,
  TextField,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import abi from "abis/nft";
import marketABI from "abis/market";
import { MARKET_ADDRESS, NFT_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import NFTVideo from "components/NFTVideo";
import { useActiveWeb3React } from "hooks/web3";
import { useSellTokenIds, useSellOfferIds, getOfferById } from "hooks/useOffer";
import { formatId } from "utils";

const useCustomStyles = makeStyles((theme) => ({
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
}));

export const Trait = ({ nft, darkTheme }) => {
  const {
    id,
    name,
    seed,
    white_image,
    black_image,
    white_single_video,
    black_single_video,
    white_triple_video,
    black_triple_video,
    owner,
  } = nft;

  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [sellPrice, setSellPrice] = useState(null);
  const [price, setPrice] = useState("");
  const [tokenName, setTokenName] = useState(name);
  const [address, setAddress] = useState("");

  const classes = useStyles();
  const customClasses = useCustomStyles();
  const { account, library } = useActiveWeb3React();
  const history = useHistory();

  const sellOfferIds = useSellOfferIds(id);
  const sellTokenIds = useSellTokenIds(account);

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

  const handleMakeSell = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer);
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
        .makeSellOffer(NFT_ADDRESS, id, ethers.utils.parseEther(price))
        .then((tx) => tx.wait());
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMakeBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);

    try {
      await market
        .makeBuyOffer(NFT_ADDRESS, id, {
          value: ethers.utils.parseEther(price),
        })
        .then((tx) => tx.wait());
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelSell = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);
    try {
      await market.cancelSellOffer(sellOfferIds[0]).then((tx) => tx.wait());
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAcceptSell = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketABI, signer);

    try {
      const offerId = sellOfferIds[0];
      const offer = await market.offers(offerId);
      await market
        .acceptSellOffer(offerId, {
          value: ethers.BigNumber.from(offer.price),
        })
        .then((tx) => tx.wait());
      history.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  const handleTransfer = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer);

    try {
      await contract.transferFrom(account, address, id).then((tx) => tx.wait());
      history.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSetTokenName = async () => {
    const signer = library.getSigner();
    const contract = new ethers.Contract(NFT_ADDRESS, abi, signer);

    try {
      await contract.setTokenName(id, tokenName).then((tx) => tx.wait());
      history.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getSellOffer = async (id) => {
      const offer = await getOfferById(library, id);
      setSellPrice(offer.price);
    };
    if (sellOfferIds.length > 0) {
      getSellOffer(sellOfferIds[0]);
    }

    return () => setSellPrice(null);
  }, [library, sellOfferIds]);

  return (
    <Box>
      <Box className={classes.section1}>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={7} md={4} lg={4}>
              <Card className={customClasses.root}>
                <CardActionArea onClick={() => setImageOpen(true)}>
                  <CardMedia
                    className={classes.nftImage}
                    image={darkTheme ? black_image : white_image}
                  />
                  <div className={classes.nftInfo}>
                    <Typography
                      className={classes.nftId}
                      variant="body1"
                      gutterBottom
                      color={darkTheme ? "textPrimary" : "textSecondary"}
                    >
                      {formatId(id)}
                    </Typography>
                    {sellPrice && (
                      <Typography className={classes.nftPrice} variant="body1">
                        {sellPrice.toFixed(4)}Ξ
                      </Typography>
                    )}
                  </div>
                </CardActionArea>
                {imageOpen && (
                  <Lightbox
                    image={darkTheme ? black_image : white_image}
                    onClose={() => setImageOpen(false)}
                  />
                )}
              </Card>
            </Grid>
            <Grid item xs={12} sm={5} md={4} lg={3}>
              <Box>
                <Typography align="left" variant="body1" color="secondary">
                  Owner
                </Typography>
                <Typography
                  align="left"
                  variant="body2"
                  color="textPrimary"
                  gutterBottom
                >
                  {owner}
                </Typography>
              </Box>
              <Box>
                <Typography align="left" variant="body1" color="secondary">
                  Seed
                </Typography>
                <Typography
                  align="left"
                  variant="body2"
                  color="textPrimary"
                  gutterBottom
                >
                  {seed}
                </Typography>
              </Box>
              {name && (
                <Box>
                  <Typography align="left" variant="body1" color="secondary">
                    Name
                  </Typography>
                  <Typography
                    align="left"
                    variant="body2"
                    color="textPrimary"
                    gutterBottom
                  >
                    {name}
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={5}>
              <Box>
                {account === nft.owner ? (
                  <>
                    <Box mb={3}>
                      <Typography gutterBottom variant="h6" align="left">
                        TRANSFER
                      </Typography>
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
                    </Box>
                    <Box mb={3}>
                      <Typography gutterBottom variant="h6" align="left">
                        PUT ON SALE
                      </Typography>
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
                          onClick={handleMakeSell}
                        >
                          Sell
                        </Button>
                      </Box>
                    </Box>
                    <Box mb={3}>
                      <Typography gutterBottom variant="h6" align="left">
                        RENAME
                      </Typography>
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
                    </Box>
                  </>
                ) : (
                  <>
                    {!sellTokenIds.includes(id) && (
                      <Box mb={3}>
                        <Typography gutterBottom variant="h6" align="left">
                          BID
                        </Typography>
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
                            onClick={handleMakeBuy}
                          >
                            Make Offer
                          </Button>
                        </Box>
                      </Box>
                    )}
                    {sellTokenIds.includes(id) ? (
                      <Box mb={3}>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={handleCancelSell}
                          size="large"
                          style={{ height: "100%" }}
                        >
                          Cancel Sell Offer
                        </Button>
                      </Box>
                    ) : (
                      nft.owner.toLowerCase() ===
                        MARKET_ADDRESS.toLowerCase() && (
                        <Box mb={3}>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={handleAcceptSell}
                            size="large"
                            style={{ height: "100%" }}
                          >
                            Buy Now for {sellPrice && sellPrice.toFixed(4)}Ξ
                          </Button>
                        </Box>
                      )
                    )}
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box className={classes.section2}>
        <Container>
          <Box mb={4}>
            <Typography variant="h4" align="center">
              <Typography component="span" variant="h4" color="secondary">
                VIDEO
              </Typography>
              &nbsp;
              <Typography component="span" variant="h4">
                GALLERY
              </Typography>
            </Typography>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <NFTVideo
                image_thumb={darkTheme ? black_image : white_image}
                onClick={handlePlay(
                  darkTheme ? black_single_video : white_single_video
                )}
              />
              <Box mt={4}>
                <Typography variant="body1" align="center">
                  Single Video
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <NFTVideo
                image_thumb={darkTheme ? black_image : white_image}
                onClick={handlePlay(
                  darkTheme ? black_triple_video : white_triple_video
                )}
              />
              <Box mt={4}>
                <Typography variant="body1" align="center">
                  Triple Video
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <ModalVideo
            channel="custom"
            url={videoPath}
            isOpen={open}
            onClose={() => setOpen(false)}
          />
        </Container>
      </Box>
    </Box>
  );
};
