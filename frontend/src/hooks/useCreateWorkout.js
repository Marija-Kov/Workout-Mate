import React from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export const useCreateWorkout = () => { 
   const { dispatch } = useWorkoutContext();
   const { user } = useAuthContext();
   const [error, setError] = React.useState(null);

   const createWorkout = async (workout) => {
      if (!user) {
       setError("You must be logged in");
       return;
     }
     const response = await fetch("/api/workouts", {
       method: "POST",
       body: JSON.stringify(workout),
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${user.token}`,
       },
     });
     const json = await response.json();


     if (!response.ok) {
       setError("Please fill out the empty fields");
       return
     }

         if (response.ok) {
           setError(null);
           dispatch({ type: "CREATE_WORKOUT", payload: json });
         }
    }

  return { createWorkout, error }
}
