import { useSelector, useDispatch } from "react-redux";
import { downloadJsonFile } from "../utils/downloadJsonFile";

export function useDownloadData() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const downloadData = async () => {
    dispatch({ type: "DOWNLOAD_DATA_REQ" });
    if (!user) {
      dispatch({
        type: "DOWNLOAD_DATA_FAIL",
        payload: "Not authorized",
      });
      return;
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
      dispatch({
        type: "DOWNLOAD_DATA_FAIL",
        payload: "Could not get data",
      });
      return;
    }
    if (response.ok) {
      dispatch({
        type: "DOWNLOAD_DATA_SUCCESS",
        payload: "Data download started",
      });
      const data = await response.json();
      downloadJsonFile(data);
    }
  };
  return { downloadData };
}
