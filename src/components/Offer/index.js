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

import { useOffer } from "hooks/useOffer";
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

const Offer = ({ offerId }) => {
  const classes = useStyles();
  const offer = useOffer(offerId);

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={offer ? `/detail/${offer.tokenId}` : "#"}
      >
        {!offer ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <CardMedia className={classes.media} image={offer.image} />
        )}
        <CardContent>
          <Typography color="secondary" variant="body1">
            {!offer ? <Skeleton animation="wave" /> : formatId(offer.tokenId)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Offer;
