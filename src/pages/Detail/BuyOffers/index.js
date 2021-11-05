import React from "react";
import { ethers } from "ethers";
import {
  Box,
  Container,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@material-ui/core";

import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import useStyles from "config/styles";
import { useOffer } from "hooks/useOffer";

const OfferRow = ({ offerId, isOwner, account, library }) => {
  const offer = useOffer(offerId);
  const classes = useStyles();

  const handleAcceptBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, abi, signer);

    try {
      await market.acceptBuyOffer(offerId).then((tx) => tx.wait());
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelBuy = async () => {
    const signer = library.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, abi, signer);

    try {
      await market.cancelBuyOffer(offerId).then((tx) => tx.wait());
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  if (!offer) {
    return <TableRow></TableRow>;
  }

  return (
    <TableRow>
      <TableCell>{offer.id}</TableCell>
      <TableCell className={classes.wrap}>{offer.buyer}</TableCell>
      <TableCell>{offer.price.toFixed(4)}Ξ</TableCell>
      {account && (
        <TableCell>
          {(isOwner && offer.buyer.toLowerCase() !== account.toLowerCase()) ||
          offer.seller.toLowerCase() === account.toLowerCase() ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAcceptBuy}
            >
              Accept
            </Button>
          ) : (
            offer.buyer.toLowerCase() === account.toLowerCase() && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleCancelBuy}
              >
                Cancel
              </Button>
            )
          )}
        </TableCell>
      )}
    </TableRow>
  );
};

const OfferTable = ({ offers, isOwner, account, library }) => {
  const classes = useStyles();

  return (
    <TableContainer className={classes.tablePrimary}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Price</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.length > 0 ? (
            offers.map((id, i) => (
              <OfferRow
                offerId={id}
                key={i}
                isOwner={isOwner}
                account={account}
                library={library}
              />
            ))
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={4}>
                No offers yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const BuyOffers = ({ offers, nft, account, library, sellTokenIds }) => {
  const classes = useStyles();
  return (
    <Box className={classes.section1}>
      <Container>
        <Box mb={4}>
          <Typography variant="h4">
            <Typography variant="h4" component="span">
              BUY
            </Typography>
            &nbsp;
            <Typography variant="h4" component="span" color="secondary">
              OFFERS
            </Typography>
          </Typography>
        </Box>
        <OfferTable
          offers={offers}
          isOwner={
            (account && nft.owner.toLowerCase() === account.toLowerCase()) ||
            sellTokenIds.includes(nft.id)
          }
          account={account}
          library={library}
        />
      </Container>
    </Box>
  );
};
