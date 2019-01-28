const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReposSchema = new Schema({
  github_id: { type: Number, required: true },
  name: String,
  stargazers_count: { type: Number, required: true },
  watchers_count: { type: Number, required: true },
  open_issues_count: { type: Number, required: true },
  forks_count: { type: Number, required: true },
  html_url: { type: String },
  description: { type: String },
  languages: { type: Array },
  created_at: Date,
  formated_date: { type: String, required: true },
  owner: {
    type: Object
  }
});

const Repos = mongoose.model("Repos", ReposSchema);

module.exports = Repos;
