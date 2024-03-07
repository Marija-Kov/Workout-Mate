import { useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useConfirmAccount = () => {
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const confirmAccount = async (token) => {
    dispatch({ type: "SET_LOADER" });
    if (!token) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Account confirmation token not found");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${token}`
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
