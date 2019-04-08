require("dotenv").config();

const express = require("express");
const got = require("got");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const jwt = require("express-jwt");
const blacklist = require("express-jwt-blacklist");
const { db, clientID, clientSecret, PORT } = require("./config");
const libs = require("./libs");
const Repos = require("./repos");
const logger = require("./logger").logger;

const app = express();
mongoose.connect(db, { useNewUrlParser: true });

app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(bodyParser.json({ limit: "300kb" }));
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
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // minimize risk of XSS attacks by restricting the client from reading the cookie
      secure: true, // only send cookie over https
      maxAge: 60000 * 60 * 24 // set cookie expiry length in ms
    }
  })
);

app.use(
  jwt({
    secret: "looking-for-maintainers",
    isRevoked: blacklist.isRevoked
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

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 100, // start blocking after 5 requests
  message:
    "Too many accounts created from this IP, please try again after an hour"
});

// Define routes.

app.get("/api/explore", createAccountLimiter, function(req, res) {
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

app.post("/subscribe", (req, res) => {
  libs.subscribeUser(req.body, (err, response) => {
    console.log(response);
    if (err) {
      logger.error(err);
      res.status(400).send({ error: err });
    } else {
      res.status(200).send(response);
    }
  });
});

app.get("/logout", authenticateUser, function(req, res) {
  blacklist.revoke(req.user);
  res.sendStatus(200);
});

module.exports = app;
