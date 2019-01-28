const Repos = require("./repos");
const dateFns = require("date-fns");

module.exports.saveUserRepo = ({ repo }, cb) => {
  const {
    name,
    stargazers_count,
    watchers_count,
    open_issues_count,
    created_at,
    forks_count,
    description,
    html_url,
    languages,
    owner,
    id
  } = repo;
  const { html_url: userProfileUrl, avatar_url, login } = owner;

  Repos.findOneAndUpdate(
    { github_id: id },
    {
      name: name,
      github_id: id,
      stargazers_count,
      watchers_count,
      open_issues_count,
      forks_count,
      description,
      html_url,
      languages,
      owner: {
        userProfileUrl,
        avatar_url,
        username: login
      },
      created_at,
      formated_date: dateFns.format(new Date(created_at), "MMMM D, YYYY")
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
    (error, savedData) => {
      if (error) console.log(error);
      cb(null, savedData);
    }
  );
};
