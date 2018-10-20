var express = require('express');
var passport = require('passport');
var Strategy = require('passport-github').Strategy;
const got = require("got");
const mongoose = require('mongoose');
const baseUrl = "https://api.github.com";
mongoose.connect('mongodb://node_passport:Admin123#@ds245523.mlab.com:45523/repos',{ useNewUrlParser: true });
var Repos = require('./repos');
const clientID = "b2464a59102ba2db9cb1";
const clientSecret = "4e265ceaa7bfc09315438f9d9e3d795302bca1ce";
// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new Strategy({
    clientID,
    clientSecret,
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, {...profile, accessToken, refreshToken});
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Create a new Express application.
var app = express();

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
    Repos.find({}, null, { sort: {stargazers_count: -1 },limit: 100 }, function(err, repos) {
      if (err) throw err;
    
      // object of all the users
       res.render('home', { user: req.user, repos });

    });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });

app.get('/login/facebook',
  passport.authenticate('github'));

app.get('/login/facebook/return', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


app.get("/add", async (req, res) => {
  const totalPages = Math.ceil(20377/100);
  let reposData = [];


  for(let i = 0; i<=totalPages; i++){      
    let apiUrlNew = `${baseUrl}/users/pombredanne/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=${i}`;
    console.log("((repos(((((((((apiUrlNew", apiUrlNew);
    const {body: repos} = await got(apiUrlNew, {json: true, method: 'GET'});

    reposData = [ ...reposData, ...repos];      
  }
  
  
  reposData.forEach( repoContent => {
    const { full_name, stargazers_count, watchers_count, open_issues_count, created_at, forks_count, 
      description, html_url, language, owner} = repoContent;
    const { html_url: userProfileUrl, avatar_url, login } = owner;

    var repo = new Repos({
      name: full_name,
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
    });

    repo.save(function(err, savedData) {
      if (err) throw err;
      console.log('saved successfully!--------',full_name);
    });
  });
  res.json({save: true});
});
app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  async (req, res) => {
    const { accessToken, username, _json: { public_repos } } = req.user;
    // const {body: sss} = await got(`${baseUrl}/users/sindresorhus?client_id=${clientID}&client_secret=${clientSecret}`, {json: true, method: 'GET'});
    // console.log('*******************************s*********************',sss);
    const totalPages = Math.ceil(992/100);
    let reposData = [];
    const apiUrl = `${baseUrl}/users/sindresorhus/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=1`;
    console.log(public_repos,"((repos(((((((((sddddddddddddd", apiUrl);
    const {body: repos} = await got(apiUrl, {json: true, method: 'GET'});
    console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);

    reposData = [ ...reposData, ...repos];
    if(totalPages > 1){
    for(let i = 1; i<=totalPages; i++){      
      let apiUrlNew = `${baseUrl}/users/sindresorhus/repos?client_id=${clientID}&client_secret=${clientSecret}&per_page=100&page=${i}`;
      console.log("((repos(((((((((apiUrlNew", apiUrlNew);
      const {body: repos} = await got(apiUrlNew, {json: true, method: 'GET'});
      console.log(username, "((((((((((((((repos(((((((((((((((((", repos.length);
      reposData = [ ...reposData, ...repos];      
    }
  }
    res.render('profile', { user: req.user, repos: reposData });
  });

  app.get('/publish/:repoId', async (req, res) => {
    require('connect-ensure-login').ensureLoggedIn();
    console.log("---------req.user----------",req.user)
    const { accessToken,  username } = req.user;
    const { repoId } = req.params;
  
    const apiUrl = `${baseUrl}/repos/${username}/${repoId}?token=${accessToken}`;
    console.log("((repos(((((((((sddddddddddddd", apiUrl);
    const {body: repoContent} = await got(apiUrl, {json: true, method: 'GET'});
    const { full_name, stargazers_count, watchers_count, open_issues_count, created_at, forks_count, 
      description, html_url, language, owner} = repoContent;
    const { html_url: userProfileUrl, avatar_url, login } = owner;
    console.log(full_name, watchers_count, "((((((((((((((repo data(((((((((((((((((", owner);
    var repo = new Repos({
      name: full_name,
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
    });

    repo.save(function(err, savedData) {
      if (err) throw err;
      console.log('User saved successfully!',savedData);

      res.json(savedData);
    });
    
  });

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
app.listen(3011);
