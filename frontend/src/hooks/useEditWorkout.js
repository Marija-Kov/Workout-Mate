import { useSelector, useDispatch } from 'react-redux';

export default function useEditWorkout() {
  const dispatch = useDispatch();
  const { user } =  useSelector(state => state.user)

  const editWorkout = async (id, payload, closeEdit) => {
    dispatch({type: "UPDATE_ONE_REQ"}) 
    if (!user) {
       dispatch({type: "UPDATE_ONE_FAIL", payload: "You must be logged in"})
       return;
     }
   const response = await fetch(
     `${process.env.REACT_APP_API}/api/workouts/${id}`,
     {
       method: "PATCH",
       body: JSON.stringify(payload),
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${user.token}`,
       },
     }
   );
   const json = await response.json(); 
       if (!response.ok) {
        dispatch({type: "UPDATE_ONE_FAIL", payload: json.error})
         return
       }
       if (response.ok) {
         closeEdit()
         dispatch({ type: "UPDATE_ONE_SUCCESS", payload: json });
       }
  }

  return {editWorkout}
}
