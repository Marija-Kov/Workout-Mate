import React from "react";
import { useWorkoutsContext } from "./useWorkoutContext";
import { useAuthContext } from "./useAuthContext";

export default function useDeleteWorkout() {
       const [error, setError] = React.useState(null);
       const { dispatch } = useWorkoutsContext();
       const { user } = useAuthContext();

    const deleteWorkout = async (id) => {
        if (!user) {
         setError("You must be logged in to do that");
         return
        }
        const response = await fetch(`/api/workouts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const json = await response.json();
        
        if(response.ok){
          dispatch({ type: "DELETE_ONE", payload: json}); 
          setError(null) 
        }
        if(!response.ok){
            setError(json.error);
          console.log(json.error)
        }
    }
  return { deleteWorkout, error }
}