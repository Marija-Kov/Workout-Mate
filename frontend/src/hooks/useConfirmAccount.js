import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useConfirmAccount = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const confirmAccount = async (token) => {
    dispatch({ type: "CONFIRM_ACCOUNT_REQ" });
    if (!token) {
      return flashMessage(
        "CONFIRM_ACCOUNT_FAIL",
        "Account confirmation token not found"
      );
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${token}`
    );
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("CONFIRM_ACCOUNT_FAIL", json.error);
    }
    if (response.ok) {
      return dispatch({ type: "CONFIRM_ACCOUNT_SUCCESS", payload: json.success });
    }
  };
  
  return { confirmAccount };
};
