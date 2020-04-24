import React from "react";
import "./Spinner.css";

const Spinner: React.FunctionComponent = ({ children }) => (
  <div id="wave">
    <span className="dot" />
    <span className="dot" />
    <span className="dot" />
    {children}
  </div>
);

export default Spinner;
