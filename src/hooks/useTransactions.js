import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "abis/contract";
import { CONTRACT_ADDRESS } from "constants/app";
import { useActiveWeb3React } from "./web3";

export const useTransactions = (nft) => {
  const { library } = useActiveWeb3React();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    const getTransactions = async () => {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, library);
      try {
        const filter = await contract.filters.Transfer(
          null,
          null,
          Math.floor(nft.id)
        );
        contract
          .queryFilter(filter)
          .then((events) => {
            console.log(events);
            if (isSubscribed) {
              setTransactions(events.reverse());
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
    };

    if (nft != null) {
      getTransactions();
    }

    return () => (isSubscribed = false);
  }, [library, nft]);

  return transactions;
};
