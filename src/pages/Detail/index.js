import React from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

import {
  Container,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import useStyles from "config/styles";
import { useNFT } from "hooks/useNFT";
import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import { useBuyOfferIds, useSellOfferIds, useOffer } from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";

import { Trait } from "components/Trait";
import { formatId } from "utils";

const OfferRow = ({ offerId, isBuy, isOwner, library }) => {
  const offer = useOffer(offerId);
  const history = useHistory();

  const handleAcceptBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, abi, signer);

    try {
      await market.acceptBuyOffer(offerId).then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      console.log(err);
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

  const handleCancelBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, abi, signer);

    try {
      await market.cancelBuyOffer(offerId).then((tx) => tx.wait());
      history.push("/for-sale");
    } catch (err) {
      console.log(err);
      alert("Please connect your MetaMask to Arbitrum network");
    }
  };

  if (!offer) {
    return <TableRow></TableRow>;
  }

  return (
    <TableRow>
      <TableCell>{offer.id}</TableCell>
      <TableCell>{isBuy ? offer.buyer : offer.seller}</TableCell>
      <TableCell>{offer.price.toFixed(2)} Ξ</TableCell>
      {isBuy && (
        <TableCell>
          {isOwner ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAcceptBuy}
            >
              Accept
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleCancelBuy}
            >
              Cancel
            </Button>
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

const OfferTable = ({ offers, isBuy, isOwner, library }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>{isBuy ? "Buyer" : "Seller"}</TableCell>
            <TableCell>Price</TableCell>
            {isBuy && <TableCell></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((id, i) => (
            <OfferRow
              offerId={id}
              key={i}
              isBuy={isBuy}
              isOwner={isOwner}
              library={library}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Detail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { location } = useHistory();
  const nft = useNFT(id);
  const buyOffers = useBuyOfferIds(id);
  const sellOffers = useSellOfferIds(id);
  const { account, library } = useActiveWeb3React();

  if (!nft) return null;

  return (
    <Container className={classes.root}>
      {location.state && location.state.message && (
        <Box pt={4}>
          <Alert elevation={6} variant="filled" severity="success">
            {location.state.message}
          </Alert>
        </Box>
      )}
      <Box pt={4}>
        <Typography variant="h4" gutterBottom>
          {nft.name || formatId(nft.id)}
        </Typography>
      </Box>
      <Trait nft={nft} />
      {buyOffers.length > 0 && (
        <Box py={4}>
          <Typography variant="h5" gutterBottom>
            Buy Offers
          </Typography>
          <OfferTable
            isBuy
            isOwner={nft.owner.toLowerCase() === account.toLowerCase()}
            offers={buyOffers}
            library={library}
          />
        </Box>
      )}
      {sellOffers.length > 0 && (
        <Box py={4}>
          <Typography variant="h5" gutterBottom>
            Sell Offers
          </Typography>
          <OfferTable offers={sellOffers} account={account} />
        </Box>
      )}
    </Container>
  );
};

export default Detail;
