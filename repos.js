//full_name 
//stargazers_count
//watchers_count
//open_issues_count
//created_at 
// forks_count
//description
// html_url
// language
// { 
  //  html_url
  // avatar_url
  // login
//}

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var reposSchema = new Schema({
  name: String,
  stargazers_count: { type: Number, required: true },
  watchers_count: { type: Number, required: true },
  open_issues_count: { type: Number, required: true },
  forks_count: { type: Number, required: true },
  html_url: { type: String },
  description: { type: String },
  language: { type: String },
  created_at: Date,
  owner: {
      type: Object
  }
});

// the schema is useless so far
// we need to create a model using it
var Repos = mongoose.model('Repos', reposSchema);

// make this available to our users in our Node applications
module.exports = Repos;