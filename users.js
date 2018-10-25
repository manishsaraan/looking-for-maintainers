const mongoose = require("mongoose");

const { Schema } = mongoose;
const userSchema = new Schema({
    github_id: { type: Number, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    avatar_url: { type: String, required: true },
    html_url: { type: String, required: true },
    blog: { type: String },
    email: { type: String },
    location: { type: String },
    bio: { type: String },
    public_repos: { type: String, required: true },
    public_gists: { type: String, required: true },
    followers: { type: String, required: true },
    following: { type: String, required: true },
    created_at: Date,
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
