import React from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSearch = () => {
    const [isLoading, setIsLoading] = React.useState(null); 
    const { user } = useAuthContext();
    const { dispatch } = useWorkoutContext();
    const [limit, setLimit] = React.useState(null);
    const [total, setTotal] = React.useState(null)
    
    const search = async (query, page) => {
      setIsLoading(true);
      const response = await fetch(`api/workouts/?search=${query}&p=${page}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        },
      });

      const json = await response.json();

      if(response.ok){
        setIsLoading(false);
        setLimit(json.limit);
        setTotal(json.allUserWorkoutsByQuery.length);
        dispatch({type: "SET_WORKOUTS", payload: json.workoutsChunk})
      }
      if(!response.ok){
        setIsLoading(false);
        console.log(json.error)
      }
      
    }
    return { search, isLoading, limit, total}
}