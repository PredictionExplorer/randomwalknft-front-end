import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
} from "@material-ui/core";

import useStyles from "config/styles";

import { formatId } from "utils";
import nftService from "services/nft";

const GiveawayTable = ({ tokens }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Seed</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Token</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.map((token, i) => (
            <TableRow key={i}>
              <TableCell>{token.seed}</TableCell>
              <TableCell>{token.owner}</TableCell>
              <TableCell>
                <Link
                  to={`/detail/${token.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography color="secondary">
                    {formatId(token.id)}
                  </Typography>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Giveaway = () => {
  const classes = useStyles();
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const getGiveawayTokens = async () => {
      const tokens = await nftService.giveaway();
      setTokens(tokens);
    };

    getGiveawayTokens();

    return () => setTokens([]);
  }, []);

  return (
    <Container className={classes.root}>
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Giveaway
        </Typography>
        <Typography variant="body1" gutterBottom>
          Some minters may be eligible for a giveaway. Check out our{" "}
          <a
            href="https://twitter.com/randomwalknft"
            target="_blank"
            style={{ color: "#FFB186" }}
            rel="noreferrer"
          >
            Twitter Page
          </a>{" "}
          for details.
        </Typography>
        <GiveawayTable tokens={tokens} />
      </Box>
    </Container>
  );
};

export default Giveaway;
