import { useSelector, useDispatch } from "react-redux";

export function useDownloadData() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const downloadData = async () => {
    if (!user) {
      dispatch({
        type: "DELETE_USER_FAIL", // I could have created DOWNLOAD_USER_DATA action types, but this will do the job.
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
        type: "DELETE_USER_FAIL",
        payload: "Could not get data",
      });
      return;
    }

    const data = await response.json();
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "your_data_on_workout_mate.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return { downloadData };
}
