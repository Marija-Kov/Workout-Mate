
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSearch = () => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const search = async (query) => {
      const response = await fetch("api/workouts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      const data = query
        ? json.filter((e) =>
            e.title.toLowerCase().includes(query.toLowerCase())
          )
        : json;
      if(!response.ok){
        console.log(json.error)
      }
      if(response.ok){
        dispatch({type: "SET_WORKOUTS", payload: data})
      }
    }
    return { search }
}