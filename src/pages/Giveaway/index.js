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
} from "@material-ui/core";

import useStyles from "config/styles";

import { formatId } from "utils";
import nftService from "services/nft";

const GiveawayTable = ({ tokens }) => {
  const classes = useStyles();

  console.log(tokens);
  return (
    <TableContainer className={classes.tablePrimary}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>SEED</TableCell>
            <TableCell>OWNER</TableCell>
            <TableCell>TOKEN</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokens.map((token, i) => (
            <TableRow key={i}>
              <TableCell className={classes.wrap}>{token.seed}</TableCell>
              <TableCell className={classes.wrap}>{token.owner}</TableCell>
              <TableCell>
                <Link
                  to={`/detail/${token.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Typography color="secondary" style={{ fontSize: 14 }}>
                    {formatId(token.id)}
                  </Typography>
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {tokens.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No tokens yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Giveaway = () => {
  const classes = useStyles();
  const [tokens, setTokens] = useState(null);

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
      <Box mb={3}>
        <Typography variant="h4" color="primary" align="center" gutterBottom>
          GIVEAWAY
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          Some minters may be eligible for a giveaway
        </Typography>
        <Typography variant="h6" align="center" gutterBottom>
          <Typography component="span" variant="h6">
            Check out our
          </Typography>
          &nbsp;
          <a
            href="https://twitter.com/randomwalknft"
            target="_blank"
            style={{ color: "#CC76D7", textDecoration: "none" }}
            rel="noreferrer"
          >
            Twitter Page
          </a>
          &nbsp;
          <Typography component="span" variant="h6">
            for details.
          </Typography>
        </Typography>
      </Box>
      {tokens !== null && <GiveawayTable tokens={tokens} />}
    </Container>
  );
};

export default Giveaway;
