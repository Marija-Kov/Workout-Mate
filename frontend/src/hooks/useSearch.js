
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSearch = () => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const search = async (query) => {
        console.log(`searched ${query}`)
      const response = await fetch(`api/workouts`, {
        headers: {
          "Authorization": `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log(json)

      if(response.ok){
        dispatch({type: "SET_WORKOUTS_BY_QUERY", payload: json})
        // it should dispatch SET_WORKOUTS and the payload should be the workouts filtered by query on the backend.
      }

      
      
      if(!response.ok){
        console.log(json.error)
      }
      
    }
    return { search }
}