import { useDispatch } from 'react-redux';

export const useLogout = () => {
 const
 dispatch = useDispatch();

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
     dispatch({type: 'SET_WORKOUTS_SUCCESS', payload: []})

    return "You have been logged out"
 }

 return { logout }
}