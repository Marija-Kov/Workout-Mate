import { useWorkoutsContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext";

export const deleteAllWorkouts = () => {

  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const deleteAll = async () => {
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

  return { deleteAll }
}