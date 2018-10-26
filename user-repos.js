const mongoose = require("mongoose");

const { Schema } = mongoose;
const userReposSchema = new Schema({
    github_id: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
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
        type: Object,
    },
});

const UserRepos = mongoose.model("UserRepos", userReposSchema);

module.exports = UserRepos;
