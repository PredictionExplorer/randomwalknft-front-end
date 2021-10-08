import React from "react";
import { Box, Container } from "@material-ui/core";

import useStyles from "config/styles";

import SalesSection from "./SalesSection";
import Mint from "./Mint";
import Withdrawal from "./Withdrawal";
import Footer from "./Footer";

const Home = (props) => {
  const classes = useStyles();

  return (
    <Container maxWidth={false} className={classes.root}>
      <Box
        className={classes.gridContainer}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <SalesSection />
        <Mint />
        <Withdrawal />
        <Footer />
      </Box>
    </Container>
  );
};

export default Home;
