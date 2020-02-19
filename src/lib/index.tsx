import React, { FunctionComponent } from "react";

type GitHubLoginProps = { clientID: string | undefined }

const GitHubLogin: FunctionComponent<GitHubLoginProps> = ({ clientID }) => {
  return (
    <a href={`https://github.com/login/oauth/authorize?client_id=${clientID}`}>
      GitHub Login
    </a>
  );
};

export default GitHubLogin;
export { GitHubLogin };
