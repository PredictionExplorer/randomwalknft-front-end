import React, { useEffect, useState } from "react";

import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Box,
} from "@material-ui/core";

import useStyles from "config/styles";

const SalesCard = (props) => {
  const classes = useStyles();
  const { title, count, amount, onMintNow } = props;
  return (
    <Card className={classes.salesCard}>
      <CardContent>
        <Box className={classes.salesTitle}>
          <Typography color="textSecondary" align="center" variant="h6">
            {title}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" justifyContent="center">
          <Button className={classes.salesButton} onClick={onMintNow}>
            Mint {count}
          </Button>
          <Typography component="p" align="center">
            {amount.toFixed(2)} ETH
          </Typography>
        </Box>
        <Typography
          variant="body2"
          align="center"
          className={classes.salesInfo}
        >
          {parseFloat(amount / count).toFixed(2)} ETH / Pedestrian
        </Typography>
      </CardContent>
    </Card>
  );
};

const SalesSection = () => {
  const classes = useStyles();
  const [maxSupply, setMaxSupply] = useState(null);
  const [remainingSupply, setRemainingSupply] = useState(null);

  const mintPedestrians = (count) => async () => {
    console.log(count);
  };

  useEffect(() => {
    setMaxSupply(10000);
    setRemainingSupply(9956);
  }, []);

  return (
    <Box className={classes.gridContainer}>
      {maxSupply !== null && remainingSupply !== null && (
        <Typography variant="h5" component="p" align="center" gutterBottom>
          {maxSupply} unique NFTs.
          <br /> {remainingSupply} available for minting
        </Typography>
      )}
      <Grid
        container
        justifyContent="center"
        spacing={4}
        className={classes.salesSection}
      >
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SalesCard
            title="Single"
            count={1}
            amount={0.1}
            onMintNow={mintPedestrians(1)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SalesCard
            title="Triple"
            count={3}
            amount={0.27}
            onMintNow={mintPedestrians(3)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <SalesCard
            title="A Crew"
            count={5}
            amount={0.4}
            onMintNow={mintPedestrians(5)}
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          href="https://opensea.io/"
          target="_blank"
          variant="contained"
          color="secondary"
          size="large"
          className={classes.viewButton}
        >
          View on OpenSea
        </Button>
      </Box>
    </Box>
  );
};

export default SalesSection;
