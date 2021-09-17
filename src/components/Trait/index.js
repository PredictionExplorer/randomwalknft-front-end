import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@material-ui/core";

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
    padding: theme.spacing(2),
    width: "40%",
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      width: "60%",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      width: "100%",
    },
  },
  content: {
    flex: "1 0 auto",
    padding: theme.spacing(1),
  },
  cover: {
    width: "40%",
    [theme.breakpoints.down("xs")]: {
      height: 360,
      width: "100%",
    },
  },
}));

export const Trait = ({ pedestrian }) => {
  const classes = useStyles();
  const { description, attributes, image, owner } = pedestrian;

  return (
    <Card className={classes.root}>
      <CardMedia className={classes.cover} image={image} title={description} />
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography component="h6" variant="h6">
            Owned by
          </Typography>
          <Typography color="secondary" component="span" variant="h6">
            {owner}
          </Typography>
          <Box my={3}>
            <Button
              variant="outlined"
              color="secondary"
              href="https://testnets.opensea.io/collection/pedestrians-ctnr5i1dch"
              target="_blank"
            >
              View on OpenSea
            </Button>
          </Box>
          <Box>
            {attributes && attributes.map(({ trait_type, value }, i) => (
              <Box key={i} display="flex" justifyContent="space-between" my={2}>
                <Typography component="span">{trait_type}</Typography>
                <Typography component="span">{value}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </div>
    </Card>
  );
};
