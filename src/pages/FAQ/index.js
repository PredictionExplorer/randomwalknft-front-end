import React from "react";

import { Box, Typography, Card, Container } from "@material-ui/core";

import useStyles from "config/styles";

const FAQ = () => {
  const items = [
    {
      question: "How do I buy Random Walk NFTs?",
      answer:
        "You need some ETH on Arbitrum. You can transfer ETH from Ethereum to Arbitrum here: <a style='color: #fff' href='https://bridge.arbitrum.io'>Arbitrum Bridge</a>",
    },
    {
      question: "How are the NFT images generated?",
      answer:
        "When you mint, a random number is generated for each NFT. It's called a 'seed'. We use the seed in the Python script to generate a image. " +
        "The image is then stored on IPFS.",
    },
    {
      question: "What is a Random Walk",
      answer:
        "Imagine you are standing on a 2D plane. You can take a step in one of the 4 directions (forward, back, left, right). Imagine you decide the direction of your step randomly. " +
        "If you do this a few million times and plot it you will you will get images that look like Random Walk NFTs.",
    },
    {
      question: "How are the colors generated?",
      answer:
        "By doing a random walk in the color space! At each step we modify the value of red, blue and green. So we are actually doing a random walk in a 5 dimensional space.",
    },
    {
      question: "How many Ranom Walk NFTs will there be?",
      answer:
        "Every time an NFT is minted, the price of the next mint increases. So there won't be substatially more than 10,000 NFTs.",
    },
    {
      question: "Where does the ETH go that people paid for minting?",
      answer:
        "The ETH does not go to the creator of the NFT! It is actually burned which benefits the entire Ethereum ecosystem.",
    },
    {
      question: "Who is the creator of this project?",
      answer: "<a style='color: #fff' href='https://twitter.com/TarasBob'>https://twitter.com/TarasBob</a>",
    },
    {
      question: "Why are you doing this?",
      answer:
        "I think random walks are really cool, and counterintiutive to humans. For example, did you know that a random walk in 2D space is guaranteed to return to the orgin, but in 3D it is not? " +
        "I like that you actually own the seed of each NFT. It is recorded in the contract. You could generate your image by pasting it into the Python script if you wanted to.",
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
            <Typography gutterBottom>
              <div dangerouslySetInnerHTML={{ __html: answer }} />
            </Typography>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;
