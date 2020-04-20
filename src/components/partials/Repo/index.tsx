import React from "react";
import Toggle from "react-toggle-component";
import { RepoRef } from "../../../interface";
import "../../../assets/css/profile.css";
import "react-toggle-component/styles.css";

type userRepoProps = {
  isChecked: boolean;
  repo: RepoRef;
  updateRepoStatus: (repo: RepoRef, status: boolean) => void;
};

type userRepoState = {
  isChecked: boolean;
};

class UserRepo extends React.Component<userRepoProps, userRepoState> {
  state = {
    isChecked: this.props.isChecked,
  };

  render() {
    const repo: RepoRef = this.props.repo;
    return (
      <li className="list-group-item">
        <div className="row">
          <div className="col-1">
            <i className="fa fa-book" />
          </div>
          <div className="col-8">{repo.name}</div>
          <div className="col-3">
            <Toggle
              checked={this.state.isChecked}
              name={repo.name}
              onToggle={(value: any) => {
                this.setState({ isChecked: !this.state.isChecked });
                this.props.updateRepoStatus(this.props.repo, value);
              }}
            />
          </div>
        </div>
      </li>
    );
  }
}

export default UserRepo;
