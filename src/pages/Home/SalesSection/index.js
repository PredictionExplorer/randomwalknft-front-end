import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { ethers } from "ethers";

import useStyles from "config/styles";
import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "hooks/web3";
import NFTImage from "components/NFTImage";

const SalesSection = () => {
  const classes = useStyles();

  const [nfts, setNfts] = useState([]);

  const { library } = useActiveWeb3React();

  useEffect(() => {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);
    const getBalance = async () => {
      const balance = await contract.totalSupply();
      const tokenIds = [...Array(balance.toNumber()).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const images = tokenIds.map((tokenId) => {
        const fileName = tokenId.toString().padStart(6, "0");
        return `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}.png`;
      });

      const nfts = [];
      for (let i = 0; i < Math.min(tokenIds.length, 3); i++) {
        nfts.push({ id: tokenIds[i], image: images[i] });
      }
      setNfts(nfts);
    };

    getBalance();
  }, [library]);

  return (
    <Grid
      container
      justifyContent="center"
      spacing={2}
      className={classes.salesSection}
    >
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Get a Random Walk NFT at .001 Ξ
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <NFTImage nfts={nfts} />
      </Grid>
    </Grid>
  );
};

export default SalesSection;
