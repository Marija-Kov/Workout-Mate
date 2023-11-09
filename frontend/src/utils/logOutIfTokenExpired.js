export const logOutIfTokenExpired = () => {
  if (localStorage.getItem("user")) {
    const tokenExpires = JSON.parse(localStorage.getItem("user")).tokenExpires;
    if (tokenExpires < Date.now()) {
      localStorage.removeItem("user");
      if (localStorage.getItem("username")) {
        localStorage.removeItem("username");
      }
      if (localStorage.getItem("newImg")) {
        localStorage.removeItem("newImg");
      }
      window.location.reload();
    }
  }
};
