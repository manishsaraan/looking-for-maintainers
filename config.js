const production = {
    db: process.env.DB || "mongodb://localhost/looking-for-maintainers",
    PORT: process.env.PORT || 3000,
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
};

const development = {
    db: process.env.DB || "mongodb://localhost/repos",
    PORT: process.env.PORT || 3011,
    clientID: "b2464a59102ba2db9cb1",
    clientSecret: "4e265ceaa7bfc09315438f9d9e3d795302bca1ce",
};

module.exports = process.env.NODE_ENV === "production" ? production : development;
