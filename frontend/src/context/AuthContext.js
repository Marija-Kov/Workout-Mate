import React, { useEffect } from 'react';

export const AuthContext = React.createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN":
        return {
          user: action.payload,
        };
      case "LOGOUT":
        return {
          user: null,
        };
      case "UPDATE":
        return {
          user: action.payload,
        };
      default:
        return state;
    }

}

export const AuthContextProvider = (props) => {
  
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null
    });

    useEffect(()=> {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
        dispatch({type: 'LOGIN', payload: user})
     };
    }, []);
  
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}