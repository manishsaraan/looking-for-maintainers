const production = {
    db: "looking-for-maintainers",
    cbUrl: "http://localhost:3000/login/github/return",
};

const development = {
    db: process.env.DB || "mongodb://localhost/repos",
    callbackUrl: "http://localhost:3011/login/github/return",
    PORT: process.env.PORT || 3011,
};

module.exports = process.env.NODE_ENV === "production" ? production : development;
