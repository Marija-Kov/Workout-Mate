import React from "react";

export const WorkoutsPlaceholder = () => {
  return (
    <div aria-label="loading workouts" className="workouts--placeholder">
      <div>Fetching data...</div>
      <div>Fetching data...</div>
      <div>Fetching data...</div>
    </div>
  );
};
