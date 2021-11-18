import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import { Container, Box, Divider } from "@material-ui/core";
import { Alert, ToggleButton, ToggleButtonGroup } from "@material-ui/lab";

import useStyles from "config/styles";
import { useNFT } from "hooks/useNFT";
import { useBuyOfferIds, useSellTokenIds } from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";

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

  useEffect(() => {
    const darkModes = [
      "#black_image",
      "#black_single_video",
      "#black_triple_video",
    ];
    const lightModes = [
      "#white_image",
      "#white_single_video",
      "#white_triple_video",
    ];
    if (darkModes.includes(location.hash)) {
      setDarkTheme(true);
    } else if (lightModes.includes(location.hash)) {
      setDarkTheme(false);
    }
  }, [location]);

  if (!nft) return <></>;

  return (
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
      <Trait
        nft={nft}
        darkTheme={darkTheme}
        seller={location.state ? location.state.seller : null}
      />
      <BuyOffers
        offers={buyOffers}
        nft={nft}
        account={account}
        library={library}
        sellTokenIds={sellTokenIds}
      />
    </Container>
  );
};

export default Detail;
