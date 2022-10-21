import React from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = React.useState(null);
    // disabling the button while the request is being sent to prevent sending another one
    const [isLoading, setIsLoading] = React.useState(null); 
    const { dispatch } = useAuthContext();
    // what happens after signup is fired:
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
            setError(json.error); // remember backend: res.json({error:...})
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({type:'LOGIN', payload:json});
            setIsLoading(false)
            setError(null);
        }
    }

   return { signup, isLoading, error } 
}





