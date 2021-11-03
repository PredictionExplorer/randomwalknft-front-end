import React from "react";
import { Container, Box, Typography, Button } from "@material-ui/core";

import whiteLineImage from "assets/white_line.png";
import useStyles from "config/styles";

const Home = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h4">
        <Typography variant="h4" component="span" color="primary">
          RANDOM
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span">
          WALK
        </Typography>
        &nbsp;
        <Typography variant="h4" component="span" color="secondary">
          NFT
        </Typography>
      </Typography>
      <Box mt={3}>
        <Typography variant="body1" gutterBottom>
          Minting starts November x at 7:00pm EST on Arbitrum.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Price starts at 0.001 ΞTH and increases after each mint.
        </Typography>
      </Box>
      <Box mt={3} display="flex" alignItems="center">
        <Button className={classes.mintButton} component="a" href="/mint">
          Mint now
        </Button>
        <div
          style={{
            background: `url(${whiteLineImage}) left top`,
            width: 64,
            height: 8,
          }}
        ></div>
      </Box>
    </Container>
  );
};

export default Home;
