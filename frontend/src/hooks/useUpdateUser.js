import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

export const useUpdateUser = () => {
 const { user } =  useSelector(state => state.user);
 const dispatch = useDispatch();
 
 const updateUser = React.useCallback(async (username, profileImg) => {
    dispatch({type: "UPDATE_USER_REQ"})
     if (!user) {
      dispatch({type: "UPDATE_USER_FAIL", payload: "You must be logged in"})
       return;
     }
        if (!profileImg) profileImg = user.profileImg;
        if (!username) username = user.username;
        if (username.length > 12) { 
            dispatch({type: "UPDATE_USER_FAIL", payload: "Invalid input"})
            return
        }
      const response = await fetch(
        `${process.env.REACT_APP_API}/api/users/${user.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            username: username,
            profileImg: profileImg,
          }),
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (!response.ok) {
        dispatch({type: "UPDATE_USER_FAIL", payload: json.error})
      }
      if (response.ok) {
        if(json.profileImg){
         localStorage.setItem("newImg", json.profileImg); 
        }
        if(json.username) {
          localStorage.setItem("username", json.username); 
        }
        const updatedUser = {id: json.id, email: json.email, token: json.token, username: json.username, profileImg: json.profileImg}
        dispatch({type: "UPDATE_USER_SUCCESS", payload: { user: updatedUser, success: json.success }});
      }
 }, [])
  return { updateUser }
}
