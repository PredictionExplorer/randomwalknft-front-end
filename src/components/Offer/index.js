import React from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Box,
  Grid,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

const Offer = ({ offer }) => {
  const classes = useStyles();

  return (
    <Grid item xs={6} sm={4} md={3}>
      <Card>
        <CardActionArea component={Link} to={`/detail/${offer.tokenId}`}>
          <CardMedia className={classes.media} image={offer.image} />
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="secondary" variant="body1">
                {offer.tokenName || formatId(offer.tokenId)}
              </Typography>
              <Typography color="secondary" variant="body2">
                {offer.price.toFixed(4)} Ξ
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

export default Offer;
