const useGetTokenFromUrl = () => {
    const start = window.location.href.indexOf("=");
    if (!start) return undefined;
    return window.location.href.slice(start + 1);
};

export default useGetTokenFromUrl
