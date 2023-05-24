import React from 'react';
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext";

export const useDeleteAllWorkouts = () => {
  const [error, setError] = React.useState(null);
  const { dispatch } = useWorkoutContext();
  const { user } = useAuthContext();

  const deleteAllWorkouts = async () => {
    if (!user) {
      setError("You must be logged in to do that");
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_API}/api/workouts/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if(response.ok){
        dispatch({type:"DELETE_ALL"})
        setError(null)
    }
    if (!response.ok) {
      setError("Something went wrong with deleting workouts. This could be because: 1)the account was already deleted, 2)something else. Please try logging in again to make sure that your account was deleted as requested before you contact support.");
    }
  }

  return { deleteAllWorkouts, error }
}