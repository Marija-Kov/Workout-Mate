import { useSelector, useDispatch } from "react-redux";

export const useDeleteUser = () => {
const user =  useSelector(state => state.user);
const dispatch = useDispatch(); 

 const deleteUser = async (id) => {
    dispatch({type: "DELETE_USER_REQ"})
    if (!user) {
    dispatch({type: "DELETE_USER_FAIL", payload: "You are not authorized to do that"})
       return;
     }
   const response = await fetch(`${process.env.REACT_APP_API}/api/users/${id}`, {
     method: "DELETE",
     headers: {
       Authorization: `Bearer ${user.token}`,
     },
   });
   const json = await response.json();
   if(response.ok){
    dispatch({type: "DELETE_USER_SUCCESS", payload: json.success})
   }
   if(!response.ok){
    dispatch({type: "DELETE_USER_FAIL", payload: json.error})
    return
   }
 }
 return { deleteUser }

}