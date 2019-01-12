const UserRepos = require("./user-repos");
const dateFns = require("date-fns");
const got = require("got");
const baseUrl = "https://api.github.com";
const { clientID, clientSecret } = require("./config");



// module.exports.request = async () => {
//     const apiUrl = `${baseUrl}/search/repositories?q=${repoName}+user:${username}&client_id=${clientID}&client_secret=${clientSecret}`;
//     console.log("--------------apdd------------",apiUrl);
//     const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
// }

module.exports.saveUserRepo = ({ repo, userId }, cb) => {
    const {
        name, stargazers_count, watchers_count, open_issues_count, created_at, forks_count,
        description, html_url, language, owner, id,
    } = repo;
    const { html_url: userProfileUrl, avatar_url, login } = owner;
      console.log('********saving', name);
    UserRepos.findOneAndUpdate({ github_id: id }, {
        userId: userId,
        name: name,
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
        formated_date: dateFns.format(new Date(created_at), "MMMM D, YYYY"),
    }, { upsert: true, new: true, setDefaultsOnInsert: true }, (error, savedData) => {
        if (error) console.log(error);
        cb(null, savedData);
    });
};
