import { useSelector, useDispatch } from "react-redux";
import { useFlashMessage } from "./useFlashMessage";

export const useDeleteUser = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const deleteUser = async (id) => {
    dispatch({ type: "DELETE_USER_REQ" });
    if (!user) {
      return flashMessage("DELETE_USER_FAIL", "Not authorized");
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
      return dispatch({ type: "DELETE_USER_SUCCESS", payload: json.success });
    }
    if (!response.ok) {
      return flashMessage("DELETE_USER_FAIL", json.error);
    }
  };
  
  return { deleteUser };
};
