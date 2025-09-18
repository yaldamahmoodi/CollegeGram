export const getImageUrl = (path: string): string => {
  const baseUrl = process.env.VITE_BASE_URL;
  return `${baseUrl}${path}`;
};
