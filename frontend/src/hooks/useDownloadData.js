import { useSelector, useDispatch } from "react-redux";
import { downloadJsonFile } from "../utils/downloadJsonFile";
import { useFlashMessage } from "./useFlashMessage";

export function useDownloadData() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const downloadData = async () => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/download/${user.id}`,
      {
        credentials: "include",
      }
      );
      if (!response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      return flashMessage("ERROR", "Could not get data");
    }
    if (response.ok) {
      dispatch({ type: "UNSET_LOADER" });
      const data = await response.json();
      downloadJsonFile(data);
      return flashMessage("SUCCESS", "Data download started");
    }
  };
  
  return { downloadData };
}
