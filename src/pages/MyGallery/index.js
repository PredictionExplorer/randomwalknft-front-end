import React, { useState, useEffect } from "react";

import { Container, Typography, Box } from "@material-ui/core";

import PaginationGrid from "components/PaginationGrid";

const MyGallery = () => {
  const [loading, setLoading] = useState(false);
  const [pedestrians, setPedestrians] = useState([]);

  useEffect(() => {
    let isSubscribed = true;

    const getPedestrians = async () => {
      setLoading(false);
      setPedestrians([1, 2, 3, 4, 5]);
    };

    getPedestrians();

    return () => (isSubscribed = false);
  }, []);

  return (
    <Container>
      <Box pt={6}>
        <Typography variant="h4" gutterBottom>
          My Pedestrians
        </Typography>
        <PaginationGrid
          filter={false}
          loading={loading}
          account={"0x000000000000000000000"}
          data={pedestrians}
        />
      </Box>
    </Container>
  );
};

export default MyGallery;
