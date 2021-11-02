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
  Paper,
  Button,
} from "@material-ui/core";

import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";

import { useOffer } from "hooks/useOffer";

const OfferRow = ({ offerId, isOwner, account, library }) => {
  const offer = useOffer(offerId);

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
      <TableCell>{offer.buyer}</TableCell>
      <TableCell>{offer.price.toFixed(4)} Ξ</TableCell>
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
    </TableRow>
  );
};

const OfferTable = ({ offers, isOwner, account, library }) => {
  return (
    <TableContainer component={Paper}>
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
          {offers.map((id, i) => (
            <OfferRow
              offerId={id}
              key={i}
              isOwner={isOwner}
              account={account}
              library={library}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const TokenHistory = ({
  offers,
  nft,
  account,
  library,
  sellTokenIds,
}) => {
  return (
    <Box py={8} style={{ backgroundColor: '#141414'}}>
      <Container>
        <Box>
          <Typography variant="h4" component="span" gutterBottom>
            TOKEN
          </Typography>
          &nbsp;&nbsp;
          <Typography
            variant="h4"
            component="span"
            gutterBottom
            color="secondary"
          >
            HISTORY
          </Typography>
        </Box>
        <OfferTable
          offers={offers}
          isOwner={
            nft.owner.toLowerCase() === account.toLowerCase() ||
            sellTokenIds.includes(nft.id)
          }
          account={account}
          library={library}
        />
      </Container>
    </Box>
  );
};
