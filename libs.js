const UserRepos = require("./user-repos");

module.exports.saveUserRepo = (repo, cb) => {
    const {
        full_name, stargazers_count, watchers_count, open_issues_count, created_at, forks_count,
        description, html_url, language, owner, id,
    } = repo;
    const { html_url: userProfileUrl, avatar_url, login } = owner;
      console.log('********saving', full_name);
    UserRepos.findOneAndUpdate({ github_id: id }, {
        userId: id,
        name: full_name,
        github_id: id,
        stargazers_count,
        watchers_count,
        open_issues_count,
        forks_count,
        description,
        html_url,
        language,
        owner: {
            userProfileUrl,
            avatar_url,
            username: login,
        },
        created_at,
    }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error, savedData) => {
        if (error) console.log(error);
        cb(null, savedData);
        // do something with the document
    });
};
