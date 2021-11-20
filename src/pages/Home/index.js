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
import linesImage from "assets/lines.png";
import backImage from "assets/back.png";
import useStyles from "config/styles";

const Home = (props) => {
  const classes = useStyles();

  return (
    <>
      <img
        src={linesImage}
        alt="lines"
        style={{
          position: "fixed",
          bottom: 100,
          objectFit: "fill",
          height: 400,
          minWidth: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: `url(${backImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          height: "100vh",
        }}
      >
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
            <Typography align="left" variant="body1" gutterBottom>
              Minting starts 11/11/2021 at 7:00pm EST on{" "}
              <Link
                target="_blank"
                href="https://arbitrum.io"
                style={{ cursor: "pointer" }}
              >
                Arbitrum
              </Link>
              .
            </Typography>
            <Typography align="left" variant="body1" gutterBottom>
              Price starts at 0.001 ΞTH and increases after each mint.
            </Typography>
            <Typography align="left" variant="body1" gutterBottom>
              100% of the ΞTH spent on minting goes back to the minters. Check
              the&nbsp;
              <Link href="/redeem" style={{ cursor: "pointer" }}>
                redeem
              </Link>{" "}
              page.
            </Typography>
            <Typography align="left" variant="body1" gutterBottom>
              Trade your NFTs on the 0% fee marketplace after November 11.
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
      </div>
    </>
  );
};

export default Home;
