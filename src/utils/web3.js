export const formatAddress = (account) =>
  account
    ? `${account.slice(0, 6)}...${account.slice(
        account.length - 4,
        account.length
      )}`
    : "";
