import React from "react";

import { Grid, Box, Typography, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

import useStyles from "config/styles";

import { NFT_ADDRESS, MARKET_ADDRESS } from "constants/app";

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid id="footer" container className={classes.gridContainer}>
      <Grid item xs={12} className={classes.footer}>
        <Box mb={2}>
          <Typography>Verified NFT Contract:</Typography>
          <Typography color="secondary" className={classes.address}>
            {NFT_ADDRESS}
          </Typography>
        </Box>
        <Box>
          <Typography>Verified Market Contract:</Typography>
          <Typography color="secondary" className={classes.address}>
            {MARKET_ADDRESS}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <div className={classes.socialButtons}>
          <IconButton href="https://twitter.com/RandomWalkNFT" target="_blank">
            <FontAwesomeIcon icon={faTwitter} />
          </IconButton>
          <IconButton href="https://discord.gg/bGnPn96Qwt" target="_blank">
            <FontAwesomeIcon icon={faDiscord} />
          </IconButton>
        </div>
      </Grid>
    </Grid>
  );
};

export default Footer;
