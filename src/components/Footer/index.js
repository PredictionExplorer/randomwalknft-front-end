import React from "react";

import {
  AppBar,
  Toolbar,
  Box,
  Grid,
  Typography,
  IconButton,
  Container,
} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

import useStyles from "config/styles";

const Footer = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="primary" className={classes.footer}>
      <Toolbar>
        <Container maxWidth="lg">
          <Box py={1}>
            <Grid container>
              <Grid
                container
                item
                sm={12}
                md={4}
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption" color="primary">
                  Arcu lacinia commodo tempus nibh varius.
                </Typography>
              </Grid>
              <Grid
                container
                item
                sm={12}
                md={4}
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  href="https://twitter.com/RandomWalkNFT"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faTwitter} size="xs" color="#C676D7" />
                </IconButton>
                <IconButton
                  href="https://discord.gg/bGnPn96Qwt"
                  target="_blank"
                >
                  <FontAwesomeIcon icon={faDiscord} size="xs" color="#C676D7" />
                </IconButton>
              </Grid>
              <Grid
                container
                item
                sm={12}
                md={4}
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption" color="primary">
                  &copy; Copyright. All rights are reserved, 2021 NFT
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
