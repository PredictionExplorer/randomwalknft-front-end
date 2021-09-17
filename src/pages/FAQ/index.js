import React from "react";

import { Box, Typography, Card, Container } from "@material-ui/core";

import useStyles from "config/styles";

const FAQ = () => {
  const items = [
    {
      question: "How do I buy Random Walk NFTs?",
      answer:
        "It’s very easy. You will need some Eth. You can buy on Coinbase or even directly from the MetaMask Wallet. More info about MetaMask here!.",
    },
    {
      question: "What can my Random Walk NFT do?",
      answer:
        "Puts you in an elite class of early adopters. We have plans for the future. follow the official Random Walk NFTs Twitter to stay up to date.",
    },
    {
      question: "What is an NFT?",
      answer:
        "It stands for non-fungible token which is nerd speak for a unique one of kind item that is provably rare. Think baseball cards on steroids.",
    },
  ];

  const classes = useStyles();

  return (
    <Container className={classes.root}>
      <Box py={4}>
        {items.map(({ question, answer }, i) => (
          <Card key={i} className={classes.faqCard}>
            <Typography color="textSecondary" gutterBottom>
              {question}
            </Typography>
            <Typography gutterBottom>{answer}</Typography>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
