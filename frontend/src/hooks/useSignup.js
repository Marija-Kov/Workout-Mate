import React from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(null);
    const { dispatch } = useAuthContext();
    console.log('dispatch '+ dispatch)

    // what happens after signup is fired
    const signup = async (username, password) => {
        setIsLoading(true);
        setError(null);
        const response = await fetch('api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ username, password })
        })
        const json = await response.json();

        if (!response.ok){
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type:'LOGIN', payload:json});
            setIsLoading(false)
        }
    }

   return { signup, isLoading, error } 
}





