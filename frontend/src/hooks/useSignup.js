import { useDispatch } from "react-redux";

export const useSignup = () => {
   const dispatch = useDispatch();

    const signup = async (credentials) => { 
      dispatch({type: "SIGNUP_REQ"});
        const response = await fetch(
          `${process.env.REACT_APP_API}/api/users/signup`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          }
        );
        const json = await response.json();

        if (!response.ok){
         dispatch({type: "SIGNUP_FAIL", payload: json.error})
         setTimeout(() => {
          dispatch({type: "RESET_ERROR_AND_SUCCESS_MESSAGES"})
          }, 5000) 
        }
        if (response.ok) {
         dispatch({type: "SIGNUP_SUCCESS", payload: json.success})
        }
    }

   return { signup } 
}





