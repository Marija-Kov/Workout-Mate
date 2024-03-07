import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteUser = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const deleteUser = async (id) => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      );
      const json = await response.json();
      if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("SUCCESS", json.success);
    }
    if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", json.error);
    }
  };
  
  return { deleteUser };
};
