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

import { useTokenSellOffers, useOffer } from "hooks/useOffer";

const SellOfferRow = ({ offerId }) => {
  const offer = useOffer(offerId);

  if (!offer) {
    return <TableRow></TableRow>;
  }

  return (
    <TableRow>
      <TableCell>{offer.id}</TableCell>
      <TableCell>{offer.seller}</TableCell>
      <TableCell>{offer.price}</TableCell>
    </TableRow>
  );
};

const SellOffers = ({ tokenId }) => {
  const sellOffers = useTokenSellOffers(tokenId);

  if (!sellOffers.length) return null;

  return (
    <Box py={4}>
      <Typography variant="h5" gutterBottom>
        Sell Offers
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Seller</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sellOffers.map((id, i) => (
              <SellOfferRow offerId={id} key={i} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SellOffers;
