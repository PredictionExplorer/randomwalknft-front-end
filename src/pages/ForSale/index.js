import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@material-ui/core";
import { ethers } from "ethers";

import marketABI from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import { useActiveWeb3React } from "hooks/web3";
import { getOfferById } from "hooks/useOffer";
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
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const numOffers = await market.numOffers();
        const offerIds = [...Array(numOffers.toNumber()).keys()];
        let offers = await Promise.all(
          offerIds.map((offerId) => getOfferById(library, offerId))
        );
        const zeroAddress = ethers.constants.AddressZero;
        offers = offers
          .filter(
            (offer) => offer && offer.active && offer.buyer === zeroAddress
          )
          .sort((x, y) => x.price - y.price);
        if (isSubscribed) {
          setCollection(offers);
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
