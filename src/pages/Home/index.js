import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Hidden,
} from "@material-ui/core";

import whiteLineImage from "assets/white_line.png";
import useStyles from "config/styles";

const Home = (props) => {
  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Typography variant="h4" className={classes.centerMobile}>
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
          Minting starts November 10 at 7:00pm EST on Arbitrum.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Price starts at 0.001 ΞTH and increases after each mint.
        </Typography>
        <Typography variant="body1" gutterBottom>
          100% of the ETH spent on minting goes back to the minters. Check
          the&nbsp;
          <Link href="/redeem" style={{ cursor: "pointer" }}>
            redeem
          </Link>{" "}
          page.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Trade your NFTs on the 0% fee marketplace after November 10.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Those who mint during the first 48 hours may be eligible to receive a
          prize, check out the&nbsp;
          <Link href="/giveaway" style={{ cursor: "pointer" }}>
            giveaway
          </Link>
          .
        </Typography>
      </Box>
      <Box mt={3} className={classes.centerMobile}>
        <Button className={classes.mintButton} component="a" href="/mint">
          Mint now
        </Button>
        <Hidden smDown>
          <div
            style={{
              background: `url(${whiteLineImage}) left top`,
              width: 64,
              height: 8,
            }}
          ></div>
        </Hidden>
      </Box>
    </Container>
  );
};

export default Home;
