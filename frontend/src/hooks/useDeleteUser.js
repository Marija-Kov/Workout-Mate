import React from "react";
import { useAuthContext } from "./useAuthContext";

export const useDeleteUser = () => {
const [ error, setError ] = React.useState(null);
const { user } = useAuthContext();

 const deleteUser = async (id) => {
    if (!user) {
      setError("Not authorized")
       return;
     }
   const response = await fetch(`api/users/${id}`, {
     method: "DELETE",
     headers: {
       Authorization: `Bearer ${user.token}`,
     },
   });
   const json = await response.json();
   if(response.ok){
    setError(null)
    return "User deleted successfully"
   }
   if(!response.ok){
    setError("Couldn't delete account, user id not found in the database.")
    return
   }
 }
 return { deleteUser, error }

}