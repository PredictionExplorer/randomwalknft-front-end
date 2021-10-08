import React from "react";

import { Box, Typography, Card, Container } from "@material-ui/core";

import useStyles from "config/styles";

const FAQ = () => {
  const items = [
    {
      question: "How do I mint Random Walk NFTs?",
      answer:
        "You need some ETH on Arbitrum. You can transfer ETH from Ethereum to Arbitrum using the <a style='color: #fff' href='https://bridge.arbitrum.io'>Arbitrum Bridge</a>.",
    },
    {
      question: "How are the NFT images generated?",
      answer:
        "When you mint, a random number (called a seed) is generated for each NFT by the smart contract. We use the seed in the Python script to generate an image and videos .",
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
        "By doing a random walk in the color space! At each step we modify the value of red, blue and green. So we are actually doing a random walk in a 5 dimensional space (2 spacial dimensions and 3 color dimensions).",
    },
    {
      question: "How many Ranom Walk NFTs will there be?",
      answer:
        "Every time an NFT is minted, the price of the next mint increases. After 5,000 NFTs are minted, the mint price will be 0.24 ETH. After 10,000 NFTs are minted, mint price will be about 60 ETH.",
    },
    {
      question: "Where does the ETH go that people paid for minting?",
      answer:
        "The ETH will be distributed to some of the minters. After there hasn't been a mint for 30 days, the last minter is eligible to withdraw half of the ETH in the NFT contract. ",
    },
    {
      question: "Does the creator of the NFT get any special privileges?",
      answer:
        "No, once the contract is deployed, nobody has any speicial privileges. The creator of the NFT would have to buy the NFTs like everybody else. The creator does not get the ETH that people paid for minting. " +
        "The ETH would be distributed to some of the minters as described above. " +
        "This is inspired by how Satoshi launched Bitcoin. He did not give himself any special privileges and had to mine the coin like everybody else. ",
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
