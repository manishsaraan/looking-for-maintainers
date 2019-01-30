const express = require("express");
const got = require("got");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const { db, clientID, clientSecret, PORT } = require("./config");
const libs = require("./libs");
mongoose.connect(
  db,
  { useNewUrlParser: true }
);
const Repos = require("./repos");
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
            console.log("-----------sdf", user);
            response.json(user);
          }
        );
      } else {
        response.status(401).json({ error: "wrong code" });
      }
    }
  );
});

app.get("/api/repos/:userId", async (req, res) => {
  const { userId } = req.params;

  Repos.find({ userId })
    .populate("userId")
    .sort({ name: -1 })
    .exec(function(err, repos) {
      console.log(
        userId,
        "************************************req.user",
        repos
      );
      res.json(repos ? repos : []);
    });
});

app.get("/api/user-repo/:username/:repoName", async (req, res) => {
  const { repoName, username } = req.params;
  const apiUrl = `https://api.github.com/search/repositories?q=${repoName}+user:${username}&client_id=${clientID}&client_secret=${clientSecret}`;
  console.log("--------------apdd------------", apiUrl);
  const { body: repos } = await got(apiUrl, { json: true, method: "GET" });
  res.json(repos);
});

app.delete("/api/delete/:repoId", (req, res) => {
  const { repoId } = req.params;

  Repos.remove({ _id: repoId }, function(err) {
    if (err) {
      res.json({ ok: false });
    } else {
      res.json({ ok: true });
    }
  });
});

app.post("/api/publish", async (req, res) => {
  console.log(req.body);
  const {
    owner: { login: username },
    name: repoName
  } = req.body;
  const apiUrl = `https://api.github.com/repos/${username}/${repoName}/languages?client_id=${clientID}&client_secret=${clientSecret}`;

  const { body: languageResponse } = await got(apiUrl, {
    json: true,
    method: "GET"
  });

  libs.saveUserRepo(
    { repo: { ...req.body, languages: Object.keys(languageResponse) } },
    (err, savedRepo) => res.json(savedRepo)
  );
});

app.get("*", function(req, res) {
  res.sendfile("./client/build/index.html");
});

app.listen(PORT, () =>
  console.log(`app is running at port: ${PORT} in ${process.env.NODE_ENV} mode`)
);
