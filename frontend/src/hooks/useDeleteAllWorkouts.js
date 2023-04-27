import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext";

export const useDeleteAllWorkouts = () => {

  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const deleteAllWorkouts = async () => {
      if (!user) {
      console.log("Not authorized")
       return;
     }
    const response = await fetch(`api/workouts/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    });
    const json = await response.json();
    console.log(json)
    if(response.ok){
        dispatch({type:"DELETE_ALL"})
    }
  }

  return { deleteAllWorkouts }
}