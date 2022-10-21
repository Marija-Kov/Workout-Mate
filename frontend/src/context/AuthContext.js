import React from 'react';

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
    const userState = localStorage.getItem('user') ? 
                      localStorage.getItem('user') :
                      null;

    const [state, dispatch] = React.useReducer(authReducer, {
        user: userState
    });

    console.log('AuthContext ', state);
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {props.children}
        </AuthContext.Provider>
    )
}