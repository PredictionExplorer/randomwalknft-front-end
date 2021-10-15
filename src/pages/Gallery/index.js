import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@material-ui/core";
import { ethers } from "ethers";

import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import { useActiveWeb3React } from "hooks/web3";
import PaginationGrid from "components/PaginationGrid";

const Gallery = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState([]);

  const { library } = useActiveWeb3React();

  useEffect(() => {
    let isSubscribed = true;

    const getTokens = async () => {
      try {
        setLoading(true);
        const contract = new ethers.Contract(NFT_ADDRESS, abi, library);
        const balance = await contract.totalSupply();
        const tokenIds = [...Array(balance.toNumber()).keys()];
        if (isSubscribed) {
          setCollection(tokenIds);
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
          Random Walk NFT Gallery
        </Typography>
        <PaginationGrid loading={loading} data={collection} />
      </Box>
    </Container>
  );
};

export default Gallery;
