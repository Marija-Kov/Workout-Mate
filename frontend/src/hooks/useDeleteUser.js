
import { useAuthContext } from "./useAuthContext";

export const useDeleteUser = () => {

const { user } = useAuthContext();

 const deleteUser = async (id) => {
    if (!user) {
      console.log("Not authorized")
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
    console.log(json)
   }
 }
 return { deleteUser }

}