import React from "react";
import ViewFilter from "./View-Filter";
import LanguageFilter from "./Language-Filter";
import "./Filters.css";

type FilterTypes = {
  updateViewFn: (viewType: string) => void;
  handleSelectedLanguage: (lang: string) => void;
  selectedLanguage: string;
};

const Filters = (props: FilterTypes) => {
  const [selectedLanguage, updateSelectedLanguage] = React.useState(
    props.selectedLanguage
  );

  return (
    <div className="filters-container">
      <div className="view-filter-main">
        <ViewFilter updateViewFn={props.updateViewFn} />
      </div>
      <div className="language-filter-main">
        <LanguageFilter
          selectedLanguage={selectedLanguage}
          updateLanguage={(lang: string) => {
            updateSelectedLanguage(lang);
            props.handleSelectedLanguage(lang);
          }}
        />
      </div>
    </div>
  );
};

export default Filters;
