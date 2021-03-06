import React from "react";
import { Link } from "react-router-dom";
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
  Button,
} from "@material-ui/core";

import useStyles from "config/styles";
import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import {
  useAccountBuyOfferIds,
  useAccountSellOfferIds,
  useOffer,
} from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";

import { formatId } from "utils";

const OfferRow = ({ offerId, library }) => {
  const offer = useOffer(offerId);

  if (!offer) {
    return <TableRow></TableRow>;
  }

  const isBuy = offer.buyer !== ethers.constants.AddressZero;

  const handleCancel = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, abi, signer);

    try {
      if (isBuy) {
        await market.cancelBuyOffer(offerId).then((tx) => tx.wait());
      } else {
        await market.cancelSellOffer(offerId).then((tx) => tx.wait());
      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TableRow>
      <TableCell>{isBuy ? "BUY" : "SELL"}</TableCell>
      <TableCell>
        <Link style={{ color: "#fff" }} to={`/detail/${offer.tokenId}`}>
          {offer.tokenName || formatId(offer.tokenId)}
        </Link>
      </TableCell>
      <TableCell>{offer.price.toFixed(4)}Ξ</TableCell>
      <TableCell align="right">
        <Button variant="contained" color="primary" onClick={handleCancel}>
          Cancel
        </Button>
      </TableCell>
    </TableRow>
  );
};

const OfferTable = ({ offers, library }) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tablePrimary}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.length > 0 ? (
            offers.map((id, i) => (
              <OfferRow offerId={id} key={i} library={library} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No offers yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const MyOffers = () => {
  const classes = useStyles();
  const { account, library } = useActiveWeb3React();

  const buyOffers = useAccountBuyOfferIds(account);
  const sellOffers = useAccountSellOfferIds(account);
  const offers = buyOffers.concat(sellOffers).sort((x, y) => x - y);

  return (
    <Container className={classes.root}>
      <Box>
        <Typography color="primary" variant="h4" gutterBottom align="center">
          MY OFFERS
        </Typography>
        <OfferTable offers={offers} library={library} />
      </Box>
    </Container>
  );
};

export default MyOffers;
