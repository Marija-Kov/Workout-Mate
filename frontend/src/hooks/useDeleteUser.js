import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteUser = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const deleteUser = async () => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(`${url}/api/users`, {
      method: "DELETE",
      credentials: "include",
    });
    const json = await response.json();
    if (response.ok) {
      return flashMessage("SUCCESS", json.success);
    }
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
  };

  return { deleteUser };
};
