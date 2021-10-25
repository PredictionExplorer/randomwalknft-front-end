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
  const white_image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_white.png`;
  const white_image_thumb = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_white_thumb.jpg`;
  const white_single_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_white_single.mp4`;
  const white_triple_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_white_triple.mp4`;
  const black_image = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black.png`;
  const black_image_thumb = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black_thumb.jpg`;
  const black_single_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black_single.mp4`;
  const black_triple_video = `https://randomwalknft.s3.us-east-2.amazonaws.com/${fileName}_black_triple.mp4`;

  return {
    id: parseInt(tokenId),
    name,
    owner,
    seed,
    white_image,
    white_image_thumb,
    white_single_video,
    white_triple_video,
    black_image,
    black_image_thumb,
    black_single_video,
    black_triple_video,
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
