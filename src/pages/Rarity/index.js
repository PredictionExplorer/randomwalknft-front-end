import React from "react";

import { Box, Typography, Container } from "@material-ui/core";

import useStyles from "config/styles";

const Rarity = () => {
  const rarities = [
    { title: "Total NFTs", value: 10000 },
    { title: "Faces", value: 24 },
    { title: "Hair styles", value: 12 },
    { title: "Clothes", value: 2 },
    { title: "Skins", value: 12 },
    { title: "Eyes", value: 45 },
    { title: "Devils", value: 12 },
    { title: "Clowns", value: 12 },
    { title: "Fast Food Workers", value: 45 },
    { title: "Bald Guys", value: 12 },
  ];

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Rarity
        </Typography>
        <Box>
          {rarities.map(({ title, value }, i) => (
            <Box key={i} display="flex" justifyContent="space-between" mb={1}>
              <Typography component="span">{title}</Typography>
              <Typography component="span">{value}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Rarity;
