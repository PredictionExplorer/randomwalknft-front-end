import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/nft";
import { NFT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

const getNFTById = async (contract, tokenId) => {
  const owner = await contract.ownerOf(tokenId);
  const seed = await contract.seeds(tokenId);
  const name = await contract.tokenNames(tokenId);
  const fileName = tokenId.toString().padStart(6, "0");
  const image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}.png`;
  const image_thumb = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_thumb.jpg`;
  const single_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_single.mp4`;
  const triple_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_triple.mp4`;

  return {
    id: parseInt(tokenId),
    name,
    owner,
    seed,
    image,
    image_thumb,
    single_video,
    triple_video,
  };
};

export const useNFT = (tokenId) => {
  const { library } = useActiveWeb3React();
  const [nft, setNft] = useState(null);

  useEffect(() => {
    let isSubscribed = true;
    const getNFT = async () => {
      const contract = new ethers.Contract(NFT_ADDRESS, abi, library);
      try {
        const nft = await getNFTById(contract, tokenId);
        if (isSubscribed) {
          setNft(nft);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId != null) {
      getNFT();
    }

    return () => (isSubscribed = false);
  }, [library, tokenId]);

  return nft;
};
