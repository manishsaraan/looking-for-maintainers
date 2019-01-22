import React from "react";

const UserRepo = ({ repo, updateRepoStatus }) => {
  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-1">
          <i className="fa fa-book" />
        </div>
        <div className="col-8">{repo.name}</div>
        <div className="col-3">
          <label className="switch">
            <input type="checkbox" onChange={updateRepoStatus(repo)} />
            <span className="slider round" />
          </label>
        </div>
      </div>
    </li>
  );
};

export default UserRepo;
