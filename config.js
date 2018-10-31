const production = {
    db: process.env.DB || "mongodb://localhost/looking-for-maintainers",
    PORT: process.env.PORT || 3000,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
};

const development = {
    db: process.env.DB || "mongodb://localhost/repos",
    PORT: process.env.PORT || 3011,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
};

module.exports = process.env.NODE_ENV === "production" ? production : development;
