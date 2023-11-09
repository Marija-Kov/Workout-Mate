export const useGetAccountConfirmationToken = () => {
  const getAccountConfirmationToken = () => {
    const start = window.location.href.indexOf("=");
    if (!start) return undefined;
    const token = window.location.href.slice(start + 1);
    return token;
  };
  return { getAccountConfirmationToken };
};
