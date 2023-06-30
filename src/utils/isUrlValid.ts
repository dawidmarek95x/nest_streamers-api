export const isUrlValid = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
