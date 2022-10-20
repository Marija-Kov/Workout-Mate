import React from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuthContext(){
    const context = React.createContext(AuthContext);
    console.log(context.dispatch);
    if(!context){
        throw Error ('useAuthContext must be inside an AuthContextProvider')
    }
    return context
}

