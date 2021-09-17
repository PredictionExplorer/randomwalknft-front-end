import React from "react";
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

import useStyles from "config/styles";

import { Trait } from "components/Trait";

const Detail = () => {
  const classes = useStyles();
  const pedestrian = {};
  const transactions = [];
  const { name } = pedestrian;

  return (
    <Container className={classes.root}>
      <Box pt={4}>
        <Typography variant="h4" gutterBottom>
          {name}
        </Typography>
      </Box>
      <Trait pedestrian={pedestrian} />
      <Box py={4}>
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
      </Box>
    </Container>
  );
};

export default Detail;
