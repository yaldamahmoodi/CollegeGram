export const getImageUrl = (path: string): string => {
  const baseUrl = "http://localhost:3001/api/v1";
  return `${baseUrl}${path}`;
};
