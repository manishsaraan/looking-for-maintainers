import React from "react";

const GitHubLogin = ({ clientID }) => {
  return (
    <a href={`https://github.com/login/oauth/authorize?client_id=${clientID}`}>
      GitHub Login
    </a>
  );
};

export default GitHubLogin;
export { GitHubLogin };
