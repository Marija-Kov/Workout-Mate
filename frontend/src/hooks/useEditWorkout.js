import React from 'react'
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";

export default function useEditWorkout() {
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();
  const [error, setError] = React.useState(null);
  
  const editWorkout = async (id, payload, closeEdit) => {
     if (!user) {
       setError("You must be logged in");
       return;
     }
   const response = await fetch(
     `${process.env.REACT_APP_API}/api/workouts/${id}`,
     {
       method: "PATCH",
       body: JSON.stringify(payload),
       headers: {
         "Content-Type": "application/json",
         Authorization: `Bearer ${user.token}`,
       },
     }
   );
   const json = await response.json(); 
       if (!response.ok) {
         setError("Please fill out the empty fields");
         return
       }
       if (response.ok) {
         setError(null)
         closeEdit()
         dispatch({ type: "UPDATE_ONE", payload: json });
       }
  }

  return {editWorkout, error}
}
