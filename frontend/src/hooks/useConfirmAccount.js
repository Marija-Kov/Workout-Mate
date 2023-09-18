import { useDispatch } from 'react-redux';

export const useConfirmAccount = () => {
  const dispatch = useDispatch();

  const confirmAccount = async (token) => {
   dispatch({type: "CONFIRM_ACCOUNT_REQ"})
   if(!token){
    dispatch({type: "CONFIRM_ACCOUNT_FAIL", payload: "Account confirmation token not found"})
    return 
   }
   const response = await fetch(
     `${process.env.REACT_APP_API}/api/users/${token}`
   );
   const json = await response.json();

   if(!response.ok){
    dispatch({type: "CONFIRM_ACCOUNT_FAIL", payload: json.error})
    return
   }

   if (response.ok) {
    dispatch({type: "CONFIRM_ACCOUNT_SUCCESS", payload: json.success})
   } 
  }

  return { confirmAccount }
}
