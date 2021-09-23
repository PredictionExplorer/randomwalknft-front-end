export const formatAddress = (addr: string) => {
  if (addr) {
    return `${addr.slice(0, 6)}...${addr.slice(addr.length - 4, addr.length)}`;
  }

  return "";
};

export const formatId = (id: number) => {
  return `#${id.toString().padStart(4, "0")}`;
};
