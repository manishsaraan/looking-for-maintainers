const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create a schema
const reposSchema = new Schema({
    repo: { type: Schema.Types.ObjectId, ref: "UserRepos", required: true },
});

const Repos = mongoose.model("Repos", reposSchema);

// make this available to our users in our Node applications
module.exports = Repos;
