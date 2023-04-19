
export const logOutIfTokenExpired = () => {
  if(localStorage.getItem("user")){
     const tokenExpires = JSON.parse(localStorage.getItem("user")).tokenExpires;
   if (tokenExpires < Date.now()) {
     localStorage.removeItem("user");
     window.location.reload();
    } 
  }
};
