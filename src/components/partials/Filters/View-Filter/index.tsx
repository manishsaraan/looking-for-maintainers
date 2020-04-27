import React from "react";
import classNames from "classnames";
import { FaList, FaTable } from "react-icons/fa";
import "./View-Filter.css";

const ViewFilter = (props: { updateViewFn: (viewType: string) => void }) => {
  const [selected, updateSelected] = React.useState("grid");

  const handleClick = (type: string) => {
    props.updateViewFn(type);
    updateSelected(type);
  };

  return (
    <div className="view-type-wrap">
      <div className="view-type btn shadowed cursor-default">
        <button
          onClick={() => handleClick("grid")}
          className={classNames({
            active: selected === "grid",
          })}
        >
          <FaTable />
          Grid
        </button>
        <button
          onClick={() => handleClick("list")}
          className={classNames({
            active: selected === "list",
          })}
        >
          <FaList />
          List
        </button>
      </div>
    </div>
  );
};

export default ViewFilter;
