import { useSelector, useDispatch } from "react-redux";
import useGetJsonFile from "./useGetJsonFile";
import { useFlashMessage } from "./useFlashMessage";

export function useDownloadData() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const flashMessage = useFlashMessage();
  const { generateJsonFile, downloadJsonFile } = useGetJsonFile();
  const url = process.env.REACT_APP_API || "http://localhost:6060";

  const downloadData = async () => {
    dispatch({ type: "SET_LOADER" });
    if (!user) {
      return flashMessage("ERROR", "Not authorized");
    }
    const response = await fetch(`${url}/api/users/download`, {
      credentials: "include",
    });
    if (!response.ok) {
      return flashMessage("ERROR", "Could not get data");
    }
    if (response.ok) {
      const data = await response.json();
      const blob = generateJsonFile(data);
      downloadJsonFile(blob);
      return flashMessage("SUCCESS", "Data download started");
    }
  };

  return { downloadData };
}
