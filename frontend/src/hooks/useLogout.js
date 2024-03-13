import { useFlashMessage } from "./useFlashMessage";
import { useHardStateResetAndClearLocalStorage } from "./useHardStateResetAndClearLocalStorage";

export const useLogout = () => {
  const flashMessage = useFlashMessage();
  const { hardStateResetAndClearLocalStorage } =
    useHardStateResetAndClearLocalStorage();

  const logout = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/logout`,
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
  };
  return { logout };
};
