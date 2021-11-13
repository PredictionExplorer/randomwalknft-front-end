import React, { useState } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Container, Box, Divider } from "@material-ui/core";
import { Alert, ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import useStyles from "config/styles";
import { useNFT } from "hooks/useNFT";
import { useBuyOfferIds, useSellTokenIds } from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";
import { formatId } from "utils";

import { Trait } from "./Trait";
import { BuyOffers } from "./BuyOffers";

import "./index.css";

const Detail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { location } = useHistory();
  const nft = useNFT(id);
  const buyOffers = useBuyOfferIds(id);
  const { account, library } = useActiveWeb3React();
  const sellTokenIds = useSellTokenIds(account);
  const [darkTheme, setDarkTheme] = useState(true);

  if (!nft) return <></>;

  return (
    <>
      <Helmet>
        <title>Randomw Walk NFT: Details for {formatId(id)}</title>
        <meta
          property="og:title"
          content={`Random Walk NFT: Details for ${formatId(id)}`}
        />
        <meta property="og:image" content={nft.black_image} />
        <meta
          property="og:description"
          content={`Programmatically generated Random Walk image and video NFTs. ETH spent on minting goes back to the minters. These are the details for ${formatId(
            id
          )}}`}
        />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`Random Walkn NFT: Details for Punk ${formatId(id)}`}
        />
        <meta name="twitter:site" content="@RandomWalkNFT" />
        <meta name="twitter:image" content={nft.black_image} />
        <meta
          name="twitter:description"
          content={`Programmatically generated Random Walk image and video NFTs. ETH spent on minting goes back to the minters. These are the details for ${formatId(
            id
          )}}`}
        />
      </Helmet>
      <Container
        maxWidth={false}
        className={classes.root}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {location.state && location.state.message && (
          <Box px={8} mb={2}>
            <Alert variant="outlined" severity="success">
              {location.state.message}
            </Alert>
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ position: "relative", height: 60 }}
        >
          <Divider style={{ background: "#121212", width: "100%" }} />
          <ToggleButtonGroup
            value={darkTheme}
            exclusive
            onChange={() => setDarkTheme(!darkTheme)}
            style={{ position: "absolute" }}
          >
            <ToggleButton value={true}>Dark theme</ToggleButton>
            <ToggleButton value={false}>White theme</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Trait nft={nft} darkTheme={darkTheme} />
        <BuyOffers
          offers={buyOffers}
          nft={nft}
          account={account}
          library={library}
          sellTokenIds={sellTokenIds}
        />
      </Container>
    </>
  );
};

export default Detail;
