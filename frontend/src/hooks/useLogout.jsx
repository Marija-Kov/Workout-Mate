import { useCallback } from "react";
import { useFlashMessage } from "./useFlashMessage";
import { useHardStateResetAndClearLocalStorage } from "./useHardStateResetAndClearLocalStorage";

export const useLogout = () => {
  const flashMessage = useFlashMessage();
  const { hardStateResetAndClearLocalStorage } =
  useHardStateResetAndClearLocalStorage();
  const url = import.meta.env.VITE_API || "http://localhost:6060";

  const logout = useCallback(async () => {
    const response = await fetch(
      `${url}/api/users/logout`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logout: true }),
        credentials: "include",
      }
    );
    if (!response.ok) {
      return flashMessage("ERROR", "Could not log out");
    }
    return hardStateResetAndClearLocalStorage();
  }, [url, flashMessage, hardStateResetAndClearLocalStorage]);
  
  return { logout };
};
