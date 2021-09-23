import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

const getNFTById = async (contract, tokenId) => {
  const owner = await contract.ownerOf(tokenId);
  const seed = await contract.seeds(tokenId);
  const fileName = tokenId.toString().padStart(6, '0');
  const image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}.png`

  return { id: tokenId, owner, seed, image };
};

export const useNFTById = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const getRegular = async () => {
      if (tokenId) {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);
        try {
          const nft = await getNFTById(contract, tokenId);
          if (isSubscribed) {
            setNft(nft);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    getRegular();

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return nft;
};

export const useNFTByIndex = (type, index) => {
  const { library, account } = useActiveWeb3React();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const getNFT = async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);
      try {
        const token = await (type === "owner"
          ? contract.tokenOfOwnerByIndex(account, index)
          : contract.tokenByIndex(index));
        const tokenId = token.toNumber();
        const nft = await getNFTById(contract, tokenId);
        if (isSubscribed) {
          setNft(nft);
        }
      } catch (err) {
        console.log(err);
      }
    };
    getNFT();

    return () => (isSubscribed = false);
  }, [index, type, library, account]);

  return nft;
};
