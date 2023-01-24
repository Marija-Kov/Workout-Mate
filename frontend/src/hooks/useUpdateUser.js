import React from 'react'
import { useAuthContext } from './useAuthContext';

export const useUpdateUser = () => {
 const [error, setError] = React.useState(null);
 const [success, setSuccess] = React.useState(null)
 const [isLoading, setIsLoading] = React.useState(null); 
 const { user, dispatch } = useAuthContext();
 
 const updateUser = React.useCallback(async (username, profileImg) => {
    setIsLoading(true);
    setError(null); 
        if (!profileImg) profileImg = user.profileImg;
        if (!username) username = user.username;
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          username: username,
          profileImg: profileImg,
        }),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
        console.log(json.logError)
        setSuccess(null)
      }
      if (response.ok) {
        if(json.profileImg){
         localStorage.setItem("newImg", json.profileImg); 
        }
        if(json.username) {
          localStorage.setItem("username", json.username); 
        }
        const user = {id: json.id, email: json.email, token: json.token, username: json.username, profileImg: json.profileImg}
        dispatch({ type: "UPDATE", payload: user });
        setIsLoading(false);
        setError(null);
        setSuccess(json.success)
      }
 }, [])
  return { updateUser, isLoading, error, success }
}
