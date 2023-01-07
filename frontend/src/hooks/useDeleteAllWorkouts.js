import { useWorkoutsContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext";

export const useDeleteAllWorkouts = () => {

  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const deleteAllWorkouts = async () => {
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