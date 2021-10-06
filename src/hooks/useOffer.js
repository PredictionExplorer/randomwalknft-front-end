import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/market";
import { MARKET_CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

const getOfferById = async (contract, offerId) => {
  const offer = await contract.offers(offerId);
  const tokenId = offer.tokenId.toNumber();
  const fileName = tokenId.toString().padStart(6, "0");
  const image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}.png`;

  return {
    id: offerId,
    active: offer.active,
    buyer: offer.buyer,
    seller: offer.seller,
    price: offer.price.toNumber(),
    tokenId,
    image,
  };
};

export const useOffer = (offerId) => {
  const { library } = useActiveWeb3React();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const getOffer = async () => {
      try {
        const contract = new ethers.Contract(
          MARKET_CONTRACT_ADDRESS,
          abi,
          library
        );
        const offer = await getOfferById(contract, offerId);
        if (isSubscribed) {
          setOffer(offer);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (offerId != null) {
      getOffer();
    }

    return () => (isSubscribed = false);
  }, [library, offerId]);

  return offer;
};

export const useTokenBuyOffers = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [buyOffers, setBuyOffers] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOffers = async () => {
      try {
        const contract = new ethers.Contract(
          MARKET_CONTRACT_ADDRESS,
          abi,
          library
        );
        const buyOfferIds = await contract.getBuyOffers(parseInt(tokenId));
        if (isSubscribed) {
          setBuyOffers(buyOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId != null) {
      getOffers();
    }

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return buyOffers;
};

export const useTokenSellOffers = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [sellOffers, setSellOffers] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOffers = async () => {
      try {
        const contract = new ethers.Contract(
          MARKET_CONTRACT_ADDRESS,
          abi,
          library
        );
        const sellOfferIds = await contract.getSellOffers(parseInt(tokenId));
        if (isSubscribed) {
          setSellOffers(sellOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId != null) {
      getOffers();
    }

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return sellOffers;
};
