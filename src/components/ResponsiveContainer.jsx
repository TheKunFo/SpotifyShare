import React from "react";

const ResponsiveContainer = ({ children, className = "" }) => {
  return (
    <div
      className={`responsive-container ${className}`}
      style={{
        width: "100%",
        minWidth: "320px",
        maxWidth: "100vw",
        overflowX: "clip",
        boxSizing: "border-box",
        padding: "0",
        margin: "0",
      }}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
