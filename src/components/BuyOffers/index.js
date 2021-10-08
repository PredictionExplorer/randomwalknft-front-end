import React from "react";
import {
  Paper,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";

import { useTokenBuyOffers, useOffer } from "hooks/useOffer";

const BuyOfferRow = ({ offerId }) => {
  const offer = useOffer(offerId);

  if (!offer) {
    return <TableRow></TableRow>;
  }

  console.log(offer);

  return (
    <TableRow>
      <TableCell>{offer.id}</TableCell>
      <TableCell>{offer.buyer}</TableCell>
      <TableCell>{offer.price} Ξ</TableCell>
    </TableRow>
  );
};

const BuyOffers = ({ tokenId }) => {
  const buyOffers = useTokenBuyOffers(tokenId);

  if (!buyOffers.length) return null;

  return (
    <Box py={4}>
      <Typography variant="h5" gutterBottom>
        Buy Offers
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Buyer</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {buyOffers.map((id, i) => (
              <BuyOfferRow offerId={id} key={i} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BuyOffers;
