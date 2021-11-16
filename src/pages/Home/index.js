import React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Link,
  Hidden,
} from "@material-ui/core";
import { isMobile } from "react-device-detect";

import whiteLineImage from "assets/white_line.png";
import linesImage from "assets/lines.png";
import sampleImage from "assets/sample.png";
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
          zIndex: -1,
        }}
      />
      <img
        src={sampleImage}
        alt="sampleImage"
        style={{
          position: "fixed",
          bottom: isMobile ? 114 : 64,
          right: 0,
          zIndex: -1,
          opacity: isMobile ? 0.4 : 1,
        }}
      />
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
          <ul>
            <li>
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
            </li>
            <li>
              <Typography align="left" variant="body1" gutterBottom>
                Price starts at 0.001 ΞTH and increases after each mint.
              </Typography>
            </li>
            <li>
              <Typography align="left" variant="body1" gutterBottom>
                100% of the ΞTH spent on minting goes back to the minters. Check
                the&nbsp;
                <Link href="/redeem" style={{ cursor: "pointer" }}>
                  redeem
                </Link>{" "}
                page.
              </Typography>
            </li>
            <li>
              <Typography align="left" variant="body1" gutterBottom>
                Trade your NFTs on the 0% fee marketplace after November 11.
              </Typography>
            </li>
            {/* <li>
              <Typography align="left" variant="body1" gutterBottom>
                Those who mint during the first 48 hours may be eligible to
                receive a prize, check out the&nbsp;
                <Link href="/giveaway" style={{ cursor: "pointer" }}>
                  giveaway
                </Link>
                .
              </Typography>
            </li> */}
          </ul>
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
    </>
  );
};

export default Home;
