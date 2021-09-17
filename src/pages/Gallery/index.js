import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@material-ui/core";

import useStyles from "config/styles";
import PaginationGrid from "components/PaginationGrid";

const Gallery = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    const getCollection = async () => {
      setLoading(false);
      setCollection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    };

    getCollection();

    return () => (isSubscribed = false);
  }, []);

  return (
    <Container className={classes.root}>
      <Box pt={6}>
        <Typography variant="h4" gutterBottom>
          Random Walk NFT Gallery
        </Typography>
        <PaginationGrid
          filter={true}
          loading={loading}
          account={null}
          data={collection}
        />
      </Box>
    </Container>
  );
};

export default Gallery;
