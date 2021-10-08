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

import { useNFT } from "hooks/useNFT";
import { formatId } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    width: "100%",
    paddingTop: "64%",
  },
}));

const NFT = ({ tokenId }) => {
  const classes = useStyles();
  const nft = useNFT(tokenId);

  return (
    <Card>
      <CardActionArea component={Link} to={nft ? `/detail/${nft.id}` : "#"}>
        {!nft ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <CardMedia className={classes.media} image={nft.image} />
        )}
        <CardContent>
          <Typography color="secondary" variant="body1">
            {!nft ? (
              <Skeleton animation="wave" />
            ) : (
              nft.name || formatId(nft.id)
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NFT;
