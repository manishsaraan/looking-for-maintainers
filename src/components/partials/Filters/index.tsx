import React from "react";
import ViewFilter from "./View-Filter";
import "./Filters.css";

const Filters = (props: { updateViewFn: (viewType: string) => void }) => (
  <div className="filters-container">
    <div className="view-filter-main">
      <ViewFilter updateViewFn={props.updateViewFn} />
    </div>
  </div>
);

export default Filters;
