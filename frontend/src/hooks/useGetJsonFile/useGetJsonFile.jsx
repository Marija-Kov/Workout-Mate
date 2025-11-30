const useGetJsonFile = () => {
  const generateJsonFile = (data) => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    return blob;
  };

  const downloadJsonFile = (blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "your_data_on_workout_mate.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { generateJsonFile, downloadJsonFile };
};

export default useGetJsonFile;
