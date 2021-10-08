import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/contract";
import marketABI from "abis/market";
import { CONTRACT_ADDRESS, MARKET_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

const getOfferById = async (contract, market, offerId) => {
  const offer = await market.offers(offerId);
  const tokenId = offer.tokenId.toNumber();
  const tokenName = await contract.tokenNames(tokenId);
  const fileName = tokenId.toString().padStart(6, "0");
  const image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}.png`;

  return {
    id: offerId,
    active: offer.active,
    buyer: offer.buyer,
    seller: offer.seller,
    price: ethers.utils.formatEther(offer.price),
    tokenId,
    tokenName,
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
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const offer = await getOfferById(contract, market, offerId);
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
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const buyOfferIds = await market.getBuyOffers(parseInt(tokenId));
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
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const sellOfferIds = await market.getSellOffers(parseInt(tokenId));
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
