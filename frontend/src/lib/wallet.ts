export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString(undefined, {
    hour12: true,
  });
};
