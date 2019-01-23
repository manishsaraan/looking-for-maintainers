import React from "react";
import "../../assets/css/profile.css";
import Toggle from "./Toggle";

class UserRepo extends React.Component {
  state = {
    isChecked: false
  };
  onChange = () => {
    this.setState({ isChecked: !this.state.isChecked });
    this.props.updateRepoStatus(this.props.repo);
  };
  render() {
    const { repo } = this.props;
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-1">
            <i className="fa fa-book" />
          </div>
          <div className="col-8">{repo.name}</div>
          <div className="col-3">
            <Toggle
              isChecked={this.state.isChecked}
              updateRepoStatus={this.onChange}
            />
          </div>
        </div>
      </li>
    );
  }
}

export default UserRepo;
