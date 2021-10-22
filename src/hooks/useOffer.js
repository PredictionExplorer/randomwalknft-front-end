import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/nft";
import marketABI from "abis/market";
import { NFT_ADDRESS, MARKET_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

export const getOfferById = async (library, offerId) => {
  const contract = new ethers.Contract(NFT_ADDRESS, abi, library);
  const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
  const offer = await market.offers(offerId);
  const tokenId = offer.tokenId.toNumber();
  const tokenName = await contract.tokenNames(tokenId);
  const fileName = tokenId.toString().padStart(6, "0");
  const image_thumb = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_thumb.jpg`;

  if (NFT_ADDRESS.toLowerCase() != offer.nftAddress.toLowerCase()) {
    return null;
  }

  return {
    id: offerId,
    active: offer.active,
    buyer: offer.buyer,
    seller: offer.seller,
    price: parseFloat(ethers.utils.formatEther(offer.price)),
    tokenId,
    tokenName,
    image_thumb,
  };
};

export const useOffer = (offerId) => {
  const { library } = useActiveWeb3React();
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const getOffer = async () => {
      try {
        const offer = await getOfferById(library, offerId);
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

export const useBuyOfferIds = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [buyOfferIds, setBuyOfferIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOfferIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const buyOfferIds = await market.getBuyOffers(NFT_ADDRESS, tokenId);
        if (isSubscribed) {
          setBuyOfferIds(buyOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId != null) {
      getOfferIds();
    }

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return buyOfferIds;
};

export const useBuyTokenIds = (address) => {
  const { library } = useActiveWeb3React();
  const [buyTokenIds, setBuyTokenIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getTokenIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const buyTokenIds = await market.getBuyTokensBy(NFT_ADDRESS, address);
        if (isSubscribed) {
          setBuyTokenIds(buyTokenIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address != null) {
      getTokenIds();
    }

    return () => (isSubscribed = false);
  }, [library, address]);

  return buyTokenIds;
};

export const useAccountBuyOfferIds = (address) => {
  const { library } = useActiveWeb3React();
  const [buyOfferIds, setBuyOfferIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOfferIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const buyOfferIds = await market.getBuyOffersBy(NFT_ADDRESS, address);
        if (isSubscribed) {
          setBuyOfferIds(buyOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address != null) {
      getOfferIds();
    }

    return () => (isSubscribed = false);
  }, [library, address]);

  return buyOfferIds;
};

export const useSellOfferIds = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [sellOfferIds, setSellOfferIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOfferIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const sellOfferIds = await market.getSellOffers(NFT_ADDRESS, tokenId);
        if (isSubscribed) {
          setSellOfferIds(sellOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId != null) {
      getOfferIds();
    }

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return sellOfferIds;
};

export const useAccountSellOfferIds = (address) => {
  const { library } = useActiveWeb3React();
  const [sellOfferIds, setSellOfferIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getOfferIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const sellOfferIds = await market.getSellOffersBy(NFT_ADDRESS, address);
        if (isSubscribed) {
          setSellOfferIds(sellOfferIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address != null) {
      getOfferIds();
    }

    return () => (isSubscribed = false);
  }, [library, address]);

  return sellOfferIds;
};

export const useSellTokenIds = (address) => {
  const { library } = useActiveWeb3React();
  const [sellTokenIds, setSellTokenIds] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getTokenIds = async () => {
      try {
        const market = new ethers.Contract(MARKET_ADDRESS, marketABI, library);
        const sellTokenIds = await market.getSellTokenBy(NFT_ADDRESS, address);
        if (isSubscribed) {
          setSellTokenIds(sellTokenIds.map((id) => id.toNumber()));
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (address != null) {
      getTokenIds();
    }

    return () => (isSubscribed = false);
  }, [library, address]);

  return sellTokenIds;
};
