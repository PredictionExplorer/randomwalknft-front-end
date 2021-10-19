import React, { useEffect, useState } from "react";
import { Box, Container } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import useStyles from "config/styles";
import nftService from "services/nft";

import SalesSection from "./SalesSection";
import Mint from "./Mint";
import Footer from "./Footer";

const Home = (props) => {
  const classes = useStyles();
  const [finishedCount, setFinishedCount] = useState(null);
  const [runningCount, setRunningCount] = useState(null);

  useEffect(() => {
    const getResult = async () => {
      const { finished_count, running_count } = await nftService.result();

      setFinishedCount(finished_count);
      setRunningCount(running_count);
    };

    getResult();

    return () => {
      setFinishedCount(null);
      setRunningCount(null);
    };
  }, []);

  return (
    <Container maxWidth={false} className={classes.root}>
      <Box
        className={classes.gridContainer}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        {runningCount > 0 && (
          <Alert severity="info">
            {`Images generated: ${finishedCount}, image generation in progress: ${runningCount}`}
          </Alert>
        )}
        <SalesSection />
        <Mint />
        <Footer />
      </Box>
    </Container>
  );
};

export default Home;
