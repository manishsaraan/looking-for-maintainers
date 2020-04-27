import React from "react";
import classNames from "classnames";
import GithubColors from "github-colors";
import languages from "./languages";
import "./Language-Filter.css";

type LanguageType = {
  selectedLanguage: string;
  updateLanguage: (selectedLanguage: string) => void;
};

class LangugeFilter extends React.PureComponent<LanguageType> {
  state = {
    filterText: "",
    selectedIndex: 0,
    showDropdown: false,
  };

  filterInputRef: any = React.createRef();

  toggleDropdown = () =>
    this.setState({ showDropdown: !this.state.showDropdown });

  hideDropdown = () => {};
  filterLanguages = () => {};
  onKeyDown = () => {};

  getFilteredLanguages() {
    let availableLanguages = [...languages];

    if (this.state.filterText) {
      availableLanguages = availableLanguages.filter((language) => {
        const languageText = language.title.toLowerCase();
        const selectedText = this.state.filterText.toLowerCase();

        return languageText.indexOf(selectedText) >= 0;
      });
    }

    return availableLanguages;
  }

  getLanguageDropdown = () => {
    return (
      <div className="language-select">
        <div className="select-menu-header">
          <span className="select-menu-title">Search Language</span>
        </div>
        <div className="select-menu-filters">
          <div className="select-menu-text-filter">
            <input
              type="text"
              className="form-control"
              placeholder="Filter Languages"
              ref={this.filterInputRef}
              onBlur={this.hideDropdown}
              onChange={this.filterLanguages}
              onKeyDown={this.onKeyDown}
            />
          </div>
        </div>
        <div className="select-menu-list">{this.renderLanguages()}</div>
      </div>
    );
  };

  renderLanguages = () => {
    let availableLanguages = this.getFilteredLanguages();

    return availableLanguages.map((language, counter) => {
      const isSelectedIndex = counter === this.state.selectedIndex;

      // This will be used in making sure of the element visibility
      const refProp = isSelectedIndex ? { ref: "activeItem" } : {};
      const languageColor = GithubColors.get(language.title) || {
        color: language.title === "All Languages" ? "transparent" : "#e8e8e8",
      };

      return (
        <a
          className={classNames("select-menu-item", {
            "active-item": isSelectedIndex,
          })}
          {...refProp}
          onMouseDown={() => this.selectLanguage(counter)}
          key={counter}
        >
          <span
            className="repo-language-color"
            style={{
              backgroundColor: languageColor.color,
            }}
          ></span>
          <span className="select-menu-item-text">{language.title}</span>
        </a>
      );
    });
  };

  selectLanguage = (selectedIndex: any) => {
    const filteredLanguages = this.getFilteredLanguages();
    const selectedLanguage = filteredLanguages[selectedIndex];
    if (!selectedLanguage) {
      return;
    }

    this.setState({
      filterText: "",
      showDropdown: false,
    });

    this.props.updateLanguage(selectedLanguage.value);
  };

  render() {
    return (
      <div className="language-filter-wrap">
        <button
          onClick={this.toggleDropdown}
          className="btn btn-light language-filter shadowed"
        >
          <i className="fa fa-filter mr-2"></i>
          {this.props.selectedLanguage || "All Languages"}
        </button>
        {this.state.showDropdown && this.getLanguageDropdown()}
      </div>
    );
  }
}

export default LangugeFilter;
