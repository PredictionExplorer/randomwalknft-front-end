import React from "react";
import { Card, CardMedia } from "@material-ui/core";

import playImage from "assets/play.png";
import useStyles from "config/styles";

const NFTVideo = ({ image_thumb, onClick }) => {
  const classes = useStyles();

  return (
    <Card className={classes.nftVideo}>
      <CardMedia
        className={classes.nftImage}
        image={image_thumb}
        style={{ opacity: 0.55 }}
      />
      <img
        className={classes.nftVideoPlay}
        src={playImage}
        alt="play"
        onClick={onClick}
      />
    </Card>
  );
};

export default NFTVideo;
