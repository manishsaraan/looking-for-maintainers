import React from "react";
import Toggle from "react-toggle-component";
import "../../assets/css/profile.css";
import "react-toggle-component/styles.css";

class UserRepo extends React.Component {
  state = {
    isChecked: false
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
              checked={this.state.isChecked}
              onToggle={value => {
                this.setState({ isChecked: !this.state.isChecked });
                this.props.updateRepoStatus(this.props.repo);
              }}
            />
          </div>
        </div>
      </li>
    );
  }
}

export default UserRepo;
