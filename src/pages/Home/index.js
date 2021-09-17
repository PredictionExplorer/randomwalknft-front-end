import React from "react";
import { Container } from "@material-ui/core";

import useStyles from "config/styles";

import SalesSection from "./SalesSection";
import Footer from "./Footer";

const Home = (props) => {
  const classes = useStyles();

  return (
    <Container maxWidth={false} className={classes.root}>
      <SalesSection />
      <Footer />
    </Container>
  );
};

export default Home;
