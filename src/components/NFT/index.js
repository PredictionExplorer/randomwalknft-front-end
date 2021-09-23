import React from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

import { useNFTByIndex } from "hooks/useNFT";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    width: "100%",
    paddingTop: "100%",
  },
}));

const NFT = ({ type, index }) => {
  const classes = useStyles();
  const nft = useNFTByIndex(type, index);

  return (
    <Card>
      <CardActionArea component={Link} to={nft ? `/detail/${nft.id}` : "#"}>
        {!nft ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <CardMedia className={classes.media} image={nft.image} />
        )}
        <CardContent>
          <Typography
            color="secondary"
            variant="body2"
            style={{ overflowWrap: "anywhere" }}
          >
            {!nft ? <Skeleton animation="wave" /> : nft.seed}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NFT;
