import React from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

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
import { useTokenBuyOffers, useOffer } from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";

import { Trait } from "components/Trait";
import { formatId } from "utils";

const OfferRow = ({ offerId, account }) => {
  const offer = useOffer(offerId);

  const handleAcceptBuyOffer = () => {
    console.log("handle accept buy offer");
  };

  if (!offer) {
    return <TableRow></TableRow>;
  }

  return (
    <TableRow>
      <TableCell>{offer.id}</TableCell>
      <TableCell>{offer.buyer}</TableCell>
      <TableCell>{offer.price.toFixed(2)} Ξ</TableCell>
      <TableCell>
        {offer.buyer.toLowerCase() === account.toLowerCase() && (
          <Button onClick={handleAcceptBuyOffer}>Accept</Button>
        )}
      </TableCell>
    </TableRow>
  );
};

const OfferTable = ({ offers, account }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Buyer</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {offers.map((id, i) => (
            <OfferRow offerId={id} key={i} account={account} />
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
  const buyOffers = useTokenBuyOffers(id);
  const { account } = useActiveWeb3React();

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
      <Box py={4}>
        <Typography variant="h5" gutterBottom>
          Buy Offers
        </Typography>
        <OfferTable offers={buyOffers} account={account} />
      </Box>
    </Container>
  );
};

export default Detail;
