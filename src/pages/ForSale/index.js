import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@material-ui/core";
import { ethers } from "ethers";

import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import { useActiveWeb3React } from "hooks/web3";
import PaginationOfferGrid from "components/PaginationOfferGrid";

const ForSale = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState([]);

  const { library } = useActiveWeb3React();

  useEffect(() => {
    let isSubscribed = true;

    const getTokens = async () => {
      try {
        setLoading(true);
        const offerIds = [];
        const contract = new ethers.Contract(
          MARKET_ADDRESS,
          abi,
          library
        );
        const numOffers = await contract.numOffers();
        for (let i = 0; i < numOffers.toNumber(); i++) {
          offerIds.push(i);
        }
        if (isSubscribed) {
          setCollection(offerIds);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getTokens();

    return () => (isSubscribed = false);
  }, [library]);

  return (
    <Container className={classes.root}>
      <Box pt={6}>
        <Typography variant="h4" gutterBottom>
          Random Walk NFTs for Sale
        </Typography>
        <PaginationOfferGrid loading={loading} data={collection} />
      </Box>
    </Container>
  );
};

export default ForSale;
