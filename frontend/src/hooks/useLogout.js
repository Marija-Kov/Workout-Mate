import { useAuthContext } from './useAuthContext';
import { useWorkoutContext } from './useWorkoutContext'; 

export const useLogout = () => {
 const { dispatch } = useAuthContext();
 const { dispatch: workoutsDispatch } = useWorkoutContext();

 const logout = () => {
     if(localStorage.getItem('user')){
      localStorage.removeItem('user');
     }
     if(localStorage.getItem('newImg')){
        localStorage.removeItem('newImg')
     }
     if (localStorage.getItem("username")) {
       localStorage.removeItem("username");
     }
     dispatch({type: 'LOGOUT'})
     // clearing the global workouts state:
     workoutsDispatch({type: 'SET_WORKOUTS', payload: null})

    return "You have been logged out"
 }

 return { logout }
}