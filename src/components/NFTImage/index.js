import React, { useState, useEffect } from "react";
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

const NFTImage = ({ nfts }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (nfts.length > 0) {
      setInterval(
        () => setIndex((index) => Math.min(nfts.length - 1, (index + 1) % 3)),
        3000
      );
    }
  }, [nfts]);

  return (
    <Card>
      <CardActionArea
        component={Link}
        to={nfts.length > 0 ? `/detail/${nfts[index].id}` : "#"}
      >
        {!nfts.length ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <CardMedia className={classes.media} image={nfts[index].white_image_thumb} />
        )}
        <CardContent>
          <Typography color="secondary" variant="body1">
            {!nfts.length ? (
              <Skeleton animation="wave" />
            ) : (
              formatId(nfts[index].id)
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NFTImage;
