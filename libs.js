const dateFns = require("date-fns");
const jwt = require("jsonwebtoken");
const Repos = require("./repos");
const request = require("request");
const SECRET = "test";

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
    github_id
  } = repo;
  const { html_url: userProfileUrl, avatar_url, login } = owner;

  Repos.findOneAndUpdate(
    { github_id },
    {
      name: name,
      github_id,
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

module.exports.createToken = username => {
  return jwt.sign({ username }, SECRET, {
    expiresIn: 86400 // expires in 24 hours
  });
};

module.exports.verifyToken = (token, cb) => {
  return new Promise(resolve => {
    jwt.verify(token, SECRET, function(err, decoded) {
      if (err) resolve({ auth: false });

      resolve({ auth: true, data: decoded });
    });
  });
};

module.exports.subscribeUser = ({ email, fname, lname }, cb) => {
  request.post(
    {
      headers: {
        "content-type": "application/json",
        Authorization:
          "Basic " +
          new Buffer("any:" + process.env.MAILCHIMP_KEY).toString("base64")
      },
      url:
        "https://" +
        process.env.MAILCHIMP_INSTANCE +
        ".api.mailchimp.com/3.0/lists/" +
        process.env.MAILCHIMP_LIST +
        "/members/",
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      })
    },
    function(error, response, body) {
      if (response.statusCode === 200) {
        cb(null, body);
      } else {
        cb(error);
      }
    }
  );
};
