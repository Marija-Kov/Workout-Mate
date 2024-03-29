import React from "react";

const CustomLegend = ({ labels, colors, percentage }) => {
  return (
    <ul className="custom--legend" aria-label="muscle groups">
      {labels.map((label, index) => (
        <li
          key={label + index}
          className={
            percentage[index] > 0
              ? "muscle--group"
              : "muscle--group zero--percent"
          }
          aria-label={`${percentage[index]}% ${label}`}
        >
          <span style={{ backgroundColor: colors[index] }}></span>
          {label}
        </li>
      ))}
    </ul>
  );
};

export default CustomLegend;
