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
      <TableCell>{offer.price.toFixed(4)}Ξ</TableCell>
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

const HistoryTable = ({ histories, isOwner, account, library }) => {
  const classes = useStyles();
  return (
    <TableContainer className={classes.tableSecondary}>
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
          {histories.length > 0 ? (
            histories.map((id, i) => (
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
                No token histories yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const TokenHistory = ({
  histories,
  nft,
  account,
  library,
  sellTokenIds,
}) => {
  return (
    <Box py={8} style={{ backgroundColor: "#141414" }}>
      <Container>
        <Box mb={4}>
          <Typography variant="h4">
            <Typography variant="h4" component="span">
              TOKEN
            </Typography>
            &nbsp;
            <Typography variant="h4" component="span" color="secondary">
              HISTORY
            </Typography>
          </Typography>
        </Box>
        <HistoryTable
          histories={histories}
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
