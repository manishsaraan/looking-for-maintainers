const express = require('express');
const passport = require('passport');
const Strategy = require('passport-github').Strategy;
const got = require("got");
const mongoose = require('mongoose');
const libs = require("./libs");
const { db, clientID, clientSecret, PORT } = require("./config");

const baseUrl = "https://api.github.com";
mongoose.connect(db, { useNewUrlParser: true });
const UserRepos = require("./user-repos");
const Users = require('./users');

passport.use(new Strategy({
    clientID,
    clientSecret,
    callbackURL: '/login/github/return'
  },
  async function(accessToken, refreshToken, profile, cb) {
    const {  username, displayName, _json: {
      id, avatar_url, html_url, blog, location, email, bio, public_repos, public_gists, followers,following, created_at
    } } = profile;

    const apiUrl = `${baseUrl}/users/${username}/orgs?client_id=${clientID}&client_secret=${clientSecret}`;
    const {body: orgs} = await got(apiUrl, {json: true, method: 'GET'});
  
     console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&', orgs);
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
      created_at,
      orgs,
    };
    Users.findOneAndUpdate({ github_id: id}, userData , { upsert: true, new: true, setDefaultsOnInsert: true }, function(error, savedData) {
      if (error) console.log(error);
    //console.log("mainuaerasdfsdf&&&&&&&&&&&&&&&&&&&&&&&&&&",savedData);
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
app.use(express.static('assets'))
// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


// Define routes.

app.get('/', (req, res) => {
  UserRepos.find({}).populate('userId').sort({stargazers_count: -1 }).limit(20).exec(function(err, repos) {
    if (err) throw err;
    console.log(repos);
     res.render('index', { user: req.user });

  });
});

app.get('/explore',
  function(req, res) {
    const { q } = req.query;
    let query = {};
    if(q){
      query = { ...query, language: q }
    }

    UserRepos.find(query).populate('userId').sort({stargazers_count: -1 }).exec(function(err, repos) {
      if (err) throw err;
      console.log(repos);
       res.render('explore', { user: req.user, repos });
    });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/github',
  passport.authenticate('github'));

app.get('/login/github/return', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
  });


app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res) => {
    req.session.user  = req.user;
    const { id } = req.user;
    const { q  } = req.query;
    const placeHolder = q ? `Search in ${q}` : `Search repositories`;
  
    UserRepos.find({userId: id}).populate('userId').sort({ name: -1 }).exec(function(err, repos) { 
       console.log('************************************req.user', req.user);
       res.render('profile', { user: req.user, repos, placeHolder });
    });
    
  });


app.get('/search/:repoName', require('connect-ensure-login').ensureLoggedIn(), 
async (req, res) => {

  const { repoName } = req.params;
  const { q  } = req.query;
  const { username } = req.session.user ;
  const searchParam = q ? `org:${q}` : `user:${username}`;
  
  const apiUrl = `${baseUrl}/search/repositories?q=${repoName}+${searchParam}&client_id=${clientID}&client_secret=${clientSecret}`;
  console.log("--------------apdd------------",apiUrl);
  const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
  res.json({ repo: repos});
  
});
 
  app.delete('/delete/:repoName', (req, res) => {
    require('connect-ensure-login').ensureLoggedIn();
    const { repoName } = req.params;
    const { id } = req.user;

    UserRepos.remove({ userId: id, name:  repoName }, function(err) { 
      if(err){
        res.json({ ok: false });
      }else{
        res.json({ ok: true });
      }
    });
  });

  app.get('/publish/:repoName', async (req, res) => {
    require('connect-ensure-login').ensureLoggedIn();
    const { repoName } = req.params;
    const { q  } = req.query;
    const { username, id, orgs } = req.session.user ;

    const isUserOwnOrg = orgs.filter( ({ login }) => {
      console.log(login +'==='+ q);
      return login === q;
    });
    const searchUrl = q ? `${q}` : `${username}`;
    console.log('-------------------sdfdsfdsf--------------:',isUserOwnOrg);
    const apiUrl = `${baseUrl}/repos/${searchUrl}/${repoName}?client_id=${clientID}&client_secret=${clientSecret}`;
    console.log("--------------apdd------------",apiUrl);
    const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
    console.log(repos);    
    libs.saveUserRepo({repo: repos, userId: id}, (err, savedRepo) => res.json({ repo: savedRepo}));    
    
  });
  

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
app.listen(PORT, () => console.log(`app is running at port: ${PORT} in ${process.env.NODE_ENV} mode`));
