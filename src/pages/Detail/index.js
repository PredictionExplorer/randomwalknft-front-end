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
import { Helmet } from "react-helmet";

import useStyles from "config/styles";
import { useNFT } from "hooks/useNFT";
import abi from "abis/market";
import { MARKET_ADDRESS } from "constants/app";
import { useBuyOfferIds, useOffer } from "hooks/useOffer";
import { useActiveWeb3React } from "hooks/web3";

import { Trait } from "components/Trait";
import { formatId } from "utils";

const OfferRow = ({ offerId, isBuy, isOwner, account, library }) => {
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
      <TableCell>{isBuy ? offer.buyer : offer.seller}</TableCell>
      <TableCell>{offer.price.toFixed(4)} Ξ</TableCell>
      {isBuy && (
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

const OfferTable = ({ offers, isBuy, isOwner, account, library }) => {
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
              account={account}
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
  const { account, library } = useActiveWeb3React();

  if (!nft) return <></>;

  return (
    <>
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`Random Walk NFT: Details for ${formatId(id)}`}
        />
        <meta name="twitter:site" content="@RandomWalkNFT" />
        <meta name="twitter:image" content={nft.image_thumb} />
        <meta
          name="twitter:description"
          content="Programmatically generated Random Walk image and video NFTs. ETH spent on minting goes back to the minters."
        />
      </Helmet>
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
              offers={buyOffers}
              isBuy
              isOwner={nft.owner.toLowerCase() === account.toLowerCase()}
              account={account}
              library={library}
            />
          </Box>
        )}
      </Container>
    </>
  );
};

export default Detail;
