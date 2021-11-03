import React, { useState } from "react";
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
import { TokenHistory } from "./TokenHistory";

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
      <Container
        maxWidth={false}
        className={classes.root}
        style={{ paddingLeft: 0, paddingRight: 0 }}
      >
        {location.state && location.state.message && (
          <Box pt={4}>
            <Alert elevation={6} variant="filled" severity="success">
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
        <TokenHistory
          histories={[]}
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
