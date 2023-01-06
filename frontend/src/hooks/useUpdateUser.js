import React from 'react'
import { useAuthContext } from './useAuthContext';

export const useUpdateUser = () => {
 const [error, setError] = React.useState(null);
 const [isLoading, setIsLoading] = React.useState(null); 
 const { user, dispatch } = useAuthContext();

 const updateUser = async (profileImg) => {
    setIsLoading(true);
    setError(null); 
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          profileImg: profileImg,
        }),
        headers: { "Content-type": "application/json" },
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error);
      }
      if (response.ok) {
        localStorage.setItem("newImg", json.profileImg);
        dispatch({ type: "UPDATE", payload: json });
        setIsLoading(false);
        setError(null);
      }
 }
  return { updateUser, isLoading, error }
}
