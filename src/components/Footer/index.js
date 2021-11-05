import React from "react";

import { AppBar, Toolbar, Box, IconButton, Container } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

import useStyles from "config/styles";

const Footer = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" color="primary" className={classes.footer}>
      <Toolbar>
        <Container maxWidth="lg">
          <Box py={1} display="flex" justifyContent="center">
            <IconButton
              href="https://twitter.com/RandomWalkNFT"
              target="_blank"
            >
              <FontAwesomeIcon icon={faTwitter} size="xs" color="#C676D7" />
            </IconButton>
            <IconButton href="https://discord.gg/bGnPn96Qwt" target="_blank">
              <FontAwesomeIcon icon={faDiscord} size="xs" color="#C676D7" />
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
