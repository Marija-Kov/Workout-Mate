import { useSelector, useDispatch } from 'react-redux';

export const useDeleteAllWorkouts = () => {
  const dispatch = useDispatch();
  const { user } =  useSelector(state => state.user);

  const deleteAllWorkouts = async () => {
    dispatch({type: "DELETE_ALL_WORKOUTS_REQ"});
    if (!user) {
      dispatch({type: "DELETE_ALL_WORKOUTS_FAIL", payload: "Not authorized"});
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API}/api/workouts/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if(response.ok){
       dispatch({type:"DELETE_ALL_WORKOUTS_SUCCESS", payload: "All workouts deleted successfully"})
    }
    if (!response.ok) {
       dispatch({type: "DELETE_ALL_WORKOUTS_FAIL", payload: "Something went wrong with deleting workouts. This could be because: 1)the account was already deleted, 2)something else. Please try logging in again to make sure that your account was deleted as requested before you contact support."});
    }
  }

  return { deleteAllWorkouts }
}