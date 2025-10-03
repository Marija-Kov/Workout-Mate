import React from "react";

const ChartPlaceholder = () => {
  return (
    <div aria-label="chart placeholder" className="chart--placeholder">
      <p className="chart--placeholder--title"></p>
      <div className="chart--placeholder--circle"></div>
      <div className="chart--placeholder--legend">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
