export const truncateAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

export const truncateText = (text: string, maxLength: number = 50) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};
