import React from "react";
import { Link } from "react-router-dom";
import { Typography, Card, CardActionArea, CardMedia } from "@material-ui/core";

import useStyles from "config/styles";
import { formatId } from "utils";

const Offer = ({ offer }) => {
  const classes = useStyles();

  return (
    <Card>
      <CardActionArea component={Link} to={`/detail/${offer.tokenId}`}>
        <CardMedia className={classes.nftImage} image={offer.image_thumb} />
        <div className={classes.nftInfo}>
          <Typography className={classes.nftId} variant="body1" gutterBottom>
            {formatId(offer.tokenId)}
          </Typography>
          <Typography className={classes.nftPrice} variant="body1">
            {offer.price.toFixed(4)} Ξ
          </Typography>
        </div>
      </CardActionArea>
    </Card>
  );
};

export default Offer;
