import React, { useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Container,
  Grid,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

import useStyles from "config/styles";
import QuestionIcon from "assets/svg/question_icon.svg";

const FAQ = () => {
  const items = [
    {
      summary: "How do I mint Random Walk NFTs?",
      detail:
        "You need some ETH on Arbitrum. You can transfer ETH from Ethereum to Arbitrum using <a style='color: #fff' href='https://hop.exchange'>Hop</a> or <a style='color: #fff' href='https://bridge.arbitrum.io'>Arbitrum Bridge</a>.",
    },
    {
      summary: "How are the NFT images generated?",
      detail:
        "When you mint, a random number (called a seed) is generated for each NFT by the smart contract. We use the seed in the Python script to generate an image and videos .",
    },
    {
      summary: "What is a Random Walk",
      detail:
        "Imagine you are standing on a 2D plane. You can take a step in one of the 4 directions (forward, back, left, right). Imagine you decide the direction of your step randomly. " +
        "If you do this a few million times and plot it you will you will get images that look like Random Walk NFTs.",
    },
    {
      summary: "How are the colors generated?",
      detail:
        "By doing a random walk in the color space! At each step we modify the value of red, blue and green. So we are actually doing a random walk in a 5 dimensional space (2 spacial dimensions and 3 color dimensions).",
    },
    {
      summary: "How many Ranom Walk NFTs will there be?",
      detail:
        "Every time an NFT is minted, the price of the next mint increases. After 5,000 NFTs are minted, the mint price will be 0.24 ETH. After 10,000 NFTs are minted, mint price will be about 60 ETH.",
    },
    {
      summary: "Where does the ETH go that people paid for minting?",
      detail:
        "The ETH will be distributed to some of the minters. After there hasn't been a mint for 30 days, the last minter is eligible to withdraw half of the ETH in the NFT contract. ",
    },
    {
      summary: "Does the creator of the NFT get any special privileges?",
      detail:
        "No, once the contract is deployed, nobody has any special privileges. The creator of the NFT would have to buy the NFTs like everybody else. The creator does not get the ETH that people paid for minting. " +
        "The ETH would be distributed to some of the minters as described above. " +
        "This is inspired by how Satoshi launched Bitcoin. He did not give himself any special privileges and had to mine the coin like everybody else. ",
    },
  ];

  const classes = useStyles();

  const [expanded, setExpanded] = useState(null);

  const handleChange = (index) => (event, isExpanded) => {
    setExpanded(isExpanded ? index : false);
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h4" color="secondary" gutterBottom>
        FAQ
      </Typography>
      <Typography variatn="body1" gutterBottom>
        Get answered to all question which you may have
      </Typography>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            {items.map(({ summary, detail }, i) => (
              <Accordion
                key={i}
                expanded={expanded === i}
                onChange={handleChange(i)}
              >
                <AccordionSummary
                  color="textSecondary"
                  expandIcon={
                    expanded === i ? (
                      <RemoveIcon color="primary" fontSize="small" />
                    ) : (
                      <AddIcon color="primary" fontSize="small" />
                    )
                  }
                >
                  <Box display="flex" alignItems="center">
                    <img
                      src={QuestionIcon}
                      className={classes.questionIcon}
                      alt="icon"
                    />
                    <Typography variant="body2">{summary}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    align="left"
                    dangerouslySetInnerHTML={{ __html: detail }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Paper>
              <Box p={4}>
                <Typography variant="h5" gutterBottom>
                  Have a question?
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  style={{ lineHeight: 2 }}
                >
                  Have more questions, reach out to us on&nbsp;
                  <Link color="primary" href="https://twitter.com">
                    Twitter
                  </Link>
                  &nbsp;or&nbsp;
                  <Link color="primary" href="https://discord.com">
                    Discord
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default FAQ;
