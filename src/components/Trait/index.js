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
} from "@material-ui/core";
import PlayCircleIcon from "@material-ui/icons/PlayCircleFilled";
import { makeStyles } from "@material-ui/core/styles";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

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

export const Trait = ({ nft }) => {
  const [address, setAddress] = useState("");
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);

  const classes = useStyles();
  const { account, library } = useActiveWeb3React();
  const history = useHistory();
  const { seed, image, single_video, triple_video, owner, id } = nft;

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
    </>
  );
};
