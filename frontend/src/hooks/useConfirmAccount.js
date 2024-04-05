import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useConfirmAccount = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const confirmAccount = async (token) => {
    dispatch({ type: "SET_LOADER" });
    if (!token) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Account confirmation token not found");
    }
    const response = await fetch(
      `${url}/api/users/confirmaccount/${token}`
    );
    const json = await response.json();
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("SUCCESS", json.success);
    }
  };

  return { confirmAccount };
};
