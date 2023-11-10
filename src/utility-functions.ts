export const camelCaseToTitleCase = (keyword: string) => {
  // Split the keyword by capital letters
  const words = keyword.split(/(?=[A-Z])/);

  // Concatenate the words with a space in between after capitalizing the first letter
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

export const timestampToDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString();
};
