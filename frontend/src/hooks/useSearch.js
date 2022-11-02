
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSearch = () => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const search = async (query) => {
      const response = await fetch(`api/workouts/?search=${query}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
      });

      const json = await response.json();

      if(response.ok){
        dispatch({type: "SET_WORKOUTS", payload: json})
        // it should dispatch SET_WORKOUTS and the payload should be the workouts filtered by query on the backend.
      }

      
      
      if(!response.ok){
        console.log(json.error)
      }
      
    }
    return { search }
}