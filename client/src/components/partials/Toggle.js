import React from "react";

class Toggle extends React.Component {
  render() {
    return (
      <label className="switch">
        <input
          type="checkbox"
          value={this.props.isChecked}
          onChange={this.props.updateRepoStatus}
        />
        <div className="slider" />
      </label>
    );
  }
}

export default Toggle;
