import React from "react";
import { useHistory } from "react-router";
import { useParams } from "react-router-dom";

import {
  Container,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import useStyles from "config/styles";
import { useNFTById } from "hooks/useNFT";
import { useTransactions } from "hooks/useTransactions";

import { Trait } from "components/Trait";
import { formatId } from "utils";

const Detail = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { location } = useHistory();
  const nft = useNFTById(id);
  const transactions = useTransactions(nft);

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
          {formatId(nft.id)}
        </Typography>
      </Box>
      <Trait nft={nft} />
      {/* <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Transaction History
        </Typography>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell align="right">From</TableCell>
                <TableCell align="right">To</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Txn</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.slice(0, 10).map((row, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {row.event}
                  </TableCell>
                  <TableCell align="right">{row.args[0]}</TableCell>
                  <TableCell align="right">{row.args[1]}</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">{row.transactionHash}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box> */}
    </Container>
  );
};

export default Detail;
