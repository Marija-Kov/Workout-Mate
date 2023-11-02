export const useGetUrl = () => {
  const getUrl = () => {             
    return window.location.href;
  }
  return { getUrl }
}
