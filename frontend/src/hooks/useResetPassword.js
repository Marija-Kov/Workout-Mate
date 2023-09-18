import { useDispatch } from "react-redux";

export default function useResetPassword() {
    const dispatch = useDispatch();
    const resetPassword = async (token, password, confirmPassword) => {
      dispatch({type: "RESET_PASSWORD_REQ"});
      if(!token){
        dispatch({type: "RESET_PASSWORD_FAIL", payload: "Reset password token not found" })
      }
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/reset-password/${token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            password: password,
            confirmPassword: confirmPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        dispatch({type: "RESET_PASSWORD_FAIL", payload: json.error })
      } else if (response.ok) {
        dispatch({type: "RESET_PASSWORD_SUCCESS", payload: json.success })
      }
    };

  return { resetPassword };
}
