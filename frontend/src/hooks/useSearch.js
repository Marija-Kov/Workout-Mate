import React from 'react'
import { useWorkoutsContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useSearch = () => {
    const [isLoading, setIsLoading] = React.useState(null); 
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [limit, setLimit] = React.useState(null);
    // const [total, setTotal] = React.useState(0);
    const [currPageItemsNum, setCurrPageItemsNum] = React.useState(null);
    
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
        setCurrPageItemsNum(json.workouts.length)
        // setTotal(json.total);
        dispatch({type: "SET_WORKOUTS", payload: json.workouts})
      }
      if(!response.ok){
        setIsLoading(false);
        console.log(json.error)
      }
      
    }
    return { search, isLoading, limit, currPageItemsNum }
}