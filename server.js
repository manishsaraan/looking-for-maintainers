const express = require("express");
const got = require("got");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const { db, clientID, clientSecret, PORT } = require("./config");
const libs = require("./libs");
mongoose.connect(db, { useNewUrlParser: true });
const Repos = require("./repos");
const logger = require("./logger").logger;
const app = express();

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(
  require("express-session")({
    secret: "looking-for-maintainers",
    resave: true,
    saveUninitialized: true
  })
);
app.use(express.static("assets"));
app.use(express.static("./client/build"));
app.use(cors());

async function authenticateUser(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    const { auth, decoded } = await libs.verifyToken(token);
    if (!auth) {
      res.status(401).json({
        message: "Failed to authenticate token."
      });
    } else {
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      next();
    }
  } else {
    // if there is no token
    // return an error
    res.status(401).json({
      message: "No token provided."
    });
  }
}

// Define routes.

app.get("/api/explore", function(req, res) {
  const { q } = req.query;
  let query = {};
  if (q) {
    query = { ...query, language: q };
  }

  Repos.find(query)
    .populate("userId")
    .sort({ stargazers_count: -1 })
    .exec(function(err, repos) {
      if (err) throw err;
      res.json(repos);
    });
});

app.get("/api/login/github/:code", (req, response) => {
  request.post(
    {
      url: "https://github.com/login/oauth/access_token",
      form: {
        client_id: clientID,
        client_secret: clientSecret,
        code: req.params.code
      }
    },
    function(error, res, body) {
      if (body.includes("access_token")) {
        const [, tokenObj] = body.split("=");
        const [token] = tokenObj.split("&");
        console.log(error, "--------", token);
        request.get(
          {
            url: ` https://api.github.com/user`,
            headers: {
              Authorization: `token ${token}`,
              "User-Agent": "github-login"
            },
            json: true
          },
          function(error, req, user) {
            const jwtToken = libs.createToken(user.login);
            console.log("-----------sdf", { ...user, jwtToken });
            response.json({ ...user, jwtToken });
          }
        );
      } else {
        response.status(401).json({ error: "wrong code" });
      }
    }
  );
});

app.get("/api/repos/:username", authenticateUser, async (req, res) => {
  const { username } = req.params;

  Repos.find({ "owner.username": username })
    .sort({ name: -1 })
    .exec(function(err, repos) {
      res.json(repos ? repos : []);
    });
});

app.get(
  "/api/user-repo/:username/:repoName",
  authenticateUser,
  async (req, res) => {
    const { repoName, username } = req.params;

    const apiUrl = `https://api.github.com/search/repositories?q=${repoName}+user:${username}&client_id=${clientID}&client_secret=${clientSecret}`;
    console.log("--------------apdd------------", apiUrl);
    const { body: repos } = await got(apiUrl, { json: true, method: "GET" });
    res.json(repos);
  }
);

app.delete("/api/delete/:repoId", authenticateUser, (req, res) => {
  const { repoId } = req.params;

  Repos.remove({ _id: repoId }, function(err) {
    if (err) {
      res.json({ ok: false });
    } else {
      res.json({ ok: true });
    }
  });
});

app.post("/api/publish", authenticateUser, async (req, res) => {
  console.log("-----------------", req.body);

  const { owner, name: repoName } = req.body;
  const username = owner.login ? owner.login : owner.username;
  const html_url = owner.html_url ? owner.html_url : owner.userProfileUrl;

  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/languages?client_id=${clientID}&client_secret=${clientSecret}`;
  console.log("-------apiUrl----", apiUrl);
  const { body: languageResponse } = await got(apiUrl, {
    json: true,
    method: "GET"
  });
  libs.saveUserRepo(
    {
      repo: {
        ...req.body,
        owner: { ...req.body.owner, html_url, login: username },
        languages: Object.keys(languageResponse)
      }
    },
    (err, savedRepo) => res.json(savedRepo)
  );
});

app.listen(PORT, () =>
  logger.warn(`app is running at port: ${PORT} in ${process.env.NODE_ENV} mode`)
);
