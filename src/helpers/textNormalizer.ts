export const normalizeText = (text: string) => {
  return text
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
