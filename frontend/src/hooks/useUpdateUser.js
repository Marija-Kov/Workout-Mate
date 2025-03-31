import { useSelector, useDispatch } from "react-redux";
import { Buffer } from "buffer";
import { useFlashMessage } from "./useFlashMessage";

export const useUpdateUser = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const updateUser = async (username, profileImg) => {
    dispatch({ type: "SET_USER_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const body = {};
    if (
      profileImg &&
      profileImg.match(/^data:image\/jpeg/) &&
      profileImg.match(/^data:image\/png/) &&
      profileImg.match(/^data:image\/svg/)
    ) {
      return flashMessage("ERROR", "Bad input - JPG, PNG and SVG only");
    }
    if (profileImg && Buffer.byteLength(profileImg) > 1048576) {
      return flashMessage("ERROR", "Image too big - 1MB max");
    }
    body.profileImg = profileImg;
    if (username && username.trim() && username.trim().length > 12) {
      return flashMessage("ERROR", "Too long username");
    }
    if (username && username.trim() && !username.match(/^[a-zA-Z0-9._]+$/)) {
      return flashMessage(
        "ERROR",
        "Username may only contain letters, numbers, dots and underscores"
      );
    }
    if (username && username.trim()) {
      body.username = username;
    }
    const response = await fetch(`${url}/api/users`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: { "Content-type": "application/json" },
      credentials: "include",
    });
    const json = await response.json();
    if (!response.ok) {
      return flashMessage("ERROR", json.error);
    }
    if (response.ok) {
      if (json.user.profileImg) {
        localStorage.setItem("newImg", json.user.profileImg);
      }
      if (json.user.username) {
        localStorage.setItem("username", json.user.username);
      }
      dispatch({ type: "UPDATE_USER", payload: json.user });
      return flashMessage("SUCCESS", json.success);
    }
  };
  return { updateUser };
};
