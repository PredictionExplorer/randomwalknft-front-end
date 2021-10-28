import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Container, Typography, Box } from "@material-ui/core";

import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import { useActiveWeb3React } from "hooks/web3";
import PaginationGrid from "components/PaginationGrid";

const MyNFTs = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [nftIds, setNftIds] = useState([]);
  const { account, library } = useActiveWeb3React();

  useEffect(() => {
    let isSubscribed = true;

    const getTokens = async () => {
      try {
        setLoading(true);
        const contract = new ethers.Contract(NFT_ADDRESS, abi, library);
        const tokens = await contract.walletOfOwner(account);
        const nftIds = tokens.map((t) => t.toNumber());
        if (isSubscribed) {
          setNftIds(nftIds);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    if (account) {
      getTokens();
    }

    return () => (isSubscribed = false);
  }, [library, account]);

  return (
    <Container className={classes.root}>
      <Box>
        <Typography align="center" variant="h4" gutterBottom>
          <Typography variant="h4" component="span" color="secondary">
            MY
          </Typography>
          &nbsp;
          <Typography variant="h4" component="span">
            RANDOM
          </Typography>
          &nbsp;
          <Typography variant="h4" component="span" color="primary">
            WALK
          </Typography>
          &nbsp;
          <Typography variant="h4" component="span">
            NFTS
          </Typography>
        </Typography>
        <PaginationGrid loading={loading} data={nftIds} />
      </Box>
    </Container>
  );
};

export default MyNFTs;
