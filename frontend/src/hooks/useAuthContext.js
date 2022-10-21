import React from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuthContext(){
    const context = React.useContext(AuthContext);
    if(!context){
        throw Error ('useAuthContext must be inside an AuthContextProvider')
    }
    return context
}

