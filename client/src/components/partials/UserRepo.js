import React from "react";

const UserRepo = ({ repo, updateRepoStatus }) => {
  return (
    <li class="list-group-item">
      <div class="row">
        <div class="col-1">
          <i class="fa fa-book" />
        </div>
        <div class="col-8">{repo.name}</div>
        <div class="col-3">
          <label class="switch">
            <input type="checkbox" onchange={updateRepoStatus(repo)} checked />
            <span class="slider round" />
          </label>
        </div>
      </div>
    </li>
  );
};

export default UserRepo;
