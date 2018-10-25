const express = require('express');
const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const got = require("got");
const mongoose = require('mongoose');
const async = require("async");

const baseUrl = "https://api.github.com";
mongoose.connect('mongodb://node_passport:Admin123#@ds245523.mlab.com:45523/repos',{ useNewUrlParser: true });
const Repos = require('./repos');
const UserRepos = require('./user-repos');
const Users = require('./users');
const clientID = "b2464a59102ba2db9cb1";
const clientSecret = "4e265ceaa7bfc09315438f9d9e3d795302bca1ce";

passport.use(new Strategy({
    clientID,
    clientSecret,
    callbackURL: '/login/github/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
    const {  username, displayName, _json: {
      id, avatar_url, html_url, blog, location, email, bio, public_repos, public_gists, followers,following, created_at
    } } = profile;
    const userData = {
      github_id: id,
      name: displayName,
      username,
      email,
      avatar_url,
      html_url,
      blog,
      location,
      bio,
      public_repos,
      public_gists,
      followers,
      following,
      created_at
    };

    Users.findOneAndUpdate({ github_id: id}, userData , { upsert: true, new: true, setDefaultsOnInsert: true }, function(error, savedData) {
      if (error) console.log(error);
    console.log("mainuaerasdfsdf&&&&&&&&&&&&&&&&&&&&&&&&&&",savedData);
    return cb(null, { ...userData, id: savedData._id, accessToken, refreshToken });
      // do something with the document
    });
   
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
const app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.
app.get('/',
  function(req, res) {
    Repos.find({}).populate('repo').sort({stargazers_count: -1 }).limit(20).exec(function(err, repos) {
      if (err) throw err;
       res.render('home', { user: req.user, repos });

    });
    // Repos.find({}, null, { sort: {stargazers_count: -1 },limit: 100 }, );
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });


app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res) => {
    const { accessToken, username, public_repos } = req.user;
    // const {body: sss} = await got(`${baseUrl}/users/sindresorhus?client_id=${clientID}&client_secret=${clientSecret}`, {json: true, method: 'GET'});

    if(!req.session.isSynced){
    const totalPages = Math.ceil(public_repos/100);
    let reposData = [];
    const apiUrl = `${baseUrl}/users/${username}/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=1`;
    console.log(public_repos,"((repos(((((((((sddddddddddddd", apiUrl);
    const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
   //console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);

    reposData = [ ...reposData, ...repos];
    if(totalPages > 1){
    for(let i = 1; i<=totalPages; i++){      
      let apiUrlNew = `${baseUrl}/users/${username}/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=${i}`;
      console.log("((repos(((((((((apiUrlNew", apiUrlNew);
      const {body: repos} = await got(apiUrlNew, {json: true, method: 'GET'});
     // console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);
      reposData = [ ...reposData, ...repos];      
    }
  }


       async.mapSeries(reposData, (repo, cb) => {
        const { full_name, stargazers_count, watchers_count, open_issues_count, created_at, forks_count, 
          description, html_url, language, owner, id } = repo;
        const { html_url: userProfileUrl, avatar_url, login } = owner;
        
        UserRepos.findOneAndUpdate({ github_id: id}, {
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
            username: login
          },
          created_at
        }, { upsert: true, new: true, setDefaultsOnInsert: true }, function(error, savedData) {
          if (error) return;
          cb(null, savedData);
          // do something with the document
        });
       },(err, repos) => {
         console.log(repos);
         req.session.isSynced = true;
         res.render('profile', { user: req.user, repos: repos });

       });
      } else {
        console.log('***********************', req.user)
        res.render('profile', { user: req.user, repos: { } });
      }

  });

  app.get('/publish/:repoId', async (req, res) => {
    require('connect-ensure-login').ensureLoggedIn();
    // console.log("---------req.user----------",req.user)
    // const { accessToken,  username } = req.user;
    const { repoId } = req.params;
    const repo = new Repos({
      repo:repoId
    });
    // const apiUrl = `${baseUrl}/repos/${username}/${repoId}?token=${accessToken}`;
    // console.log("((repos(((((((((sddddddddddddd", apiUrl);
    // const {body: repoContent} = await got(apiUrl, {json: true, method: 'GET'});
    repo.save((err, data) => res.json({data}));
    
    
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
app.listen(3011);
