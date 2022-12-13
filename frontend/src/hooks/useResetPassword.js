
export const useResetPassword = () => {
    const resetPassword = async (email) => {
        const response = await fetch(`api/users/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        });
        const json = await response.json();
        if (!response.ok){
            console.log(json.error)
        }
        if(response.ok){
            console.log(json)
        }
    }
    return { resetPassword }
}