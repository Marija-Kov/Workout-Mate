import { useSelector, useDispatch } from "react-redux";
import { Buffer } from "buffer";

export const useUpdateUser = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const updateUser = async (username, profileImg) => {
    dispatch({ type: "UPDATE_USER_REQ" });
    if (!user) {
      dispatch({ type: "UPDATE_USER_FAIL", payload: "Not authorized" });
      return;
    }
    if (
      profileImg &&
      profileImg.match(/^data:image\/jpeg/) &&
      profileImg.match(/^data:image\/png/) &&
      profileImg.match(/^data:image\/svg/)
    ) {
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload: "Bad input - JPG, PNG and SVG only",
      });
      return;
    }
    if (profileImg && Buffer.byteLength(profileImg) > 1048576) {
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload: "Image too big - 1MB max",
      });
      return setTimeout(() => {
        dispatch({ type: "RESET_USER_MESSAGE_STATE" });
      }, 5000);
    }
    if (username && username.length > 12) {
      dispatch({ type: "UPDATE_USER_FAIL", payload: "Too long username" });
      return;
    }
    if (username && !username.match(/^[a-zA-Z0-9._]+$/)) {
      dispatch({
        type: "UPDATE_USER_FAIL",
        payload:
          "Username may only contain letters, numbers, dots and underscores",
      });
      return;
    }
    const body = {
      username: username,
      profileImg: profileImg,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/${user.id}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const json = await response.json();

    if (!response.ok) {
      dispatch({ type: "UPDATE_USER_FAIL", payload: json.error });
    }
    if (response.ok) {
      if (json.user.profileImg) {
        localStorage.setItem("newImg", json.user.profileImg);
      }
      if (json.user.username) {
        localStorage.setItem("username", json.user.username);
      }
      dispatch({
        type: "UPDATE_USER_SUCCESS",
        payload: { user: json.user, success: json.success },
      });
    }

    setTimeout(() => {
      dispatch({ type: "RESET_USER_MESSAGE_STATE" });
    }, 5000);
  };
  return { updateUser };
};
