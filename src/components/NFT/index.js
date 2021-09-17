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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  media: {
    width: "100%",
    paddingTop: "100%",
  },
}));

const NFT = ({ account, index }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const pedestrian = {
    owner: "",
    image: "",
    description: "",
    id: "",
  };
  const { owner, image, description, id } = pedestrian;

  useEffect(() => {
    if (pedestrian.image) {
      setLoading(false);
    }
  }, [pedestrian]);

  return (
    <Card>
      <CardActionArea component={Link} to={`/detail/${id}`}>
        {/* {!account && (
          <CardHeader
            titleTypographyProps={{ variant: "body2", color: "secondary" }}
            title={
              loading ? (
                <Skeleton
                  animation="wave"
                  height={10}
                  width="40%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                "Owned By"
              )
            }
            subheader={
              loading ? (
                <Skeleton animation="wave" height={10} width="80%" />
              ) : (
                formatAddress(owner)
              )
            }
            subheaderTypographyProps={{ variant: "body2", color: "secondary" }}
          />
        )} */}
        {loading ? (
          <Skeleton animation="wave" variant="rect" className={classes.media} />
        ) : (
          <CardMedia
            className={classes.media}
            image={image}
            title={description}
          />
        )}
        <CardContent>
          <Typography variant="body1">
            {loading ? (
              <Skeleton animation="wave" />
            ) : (
              `#${id.toString().padStart(4, "0")}`
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NFT;
