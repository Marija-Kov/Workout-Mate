import React, { useEffect } from 'react';

export const AuthContext = React.createContext();

export const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            return {
              user: action.payload
            };
        case 'LOGOUT':
            return {
             user: null
            };
        default:
            return state
    }

}

export const AuthContextProvider = (props) => {
    // const userState = localStorage.getItem('user') || null;
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null
    });

    useEffect(()=> {
    const user = JSON.parse(localStorage.getItem('user'));
    if(user){
        dispatch({type: 'LOGIN', payload: user})
     };
    }, []);
    

    //console.log('AuthContext ', state);
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}