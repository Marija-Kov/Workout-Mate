import { useSelector, useDispatch } from "react-redux";
import { downloadJsonFile } from "../utils/downloadJsonFile";
import { useFlashMessage } from "./useFlashMessage";

export function useDownloadData() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();

  const downloadData = async () => {
    dispatch({ type: "DOWNLOAD_DATA_REQ" });
    if (!user) {
      return flashMessage("DOWNLOAD_DATA_FAIL", "Not authorized");
    }
    const response = await fetch(
      `${process.env.REACT_APP_API}/api/users/download/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    if (!response.ok) {
      return flashMessage("DOWNLOAD_DATA_FAIL", "Could not get data");
    }
    if (response.ok) {
      const data = await response.json();
      downloadJsonFile(data);
      return flashMessage("DOWNLOAD_DATA_SUCCESS", "Data download started");
    }
  };
  
  return { downloadData };
}
