const production = {
  db: process.env.DB,
  PORT: process.env.PORT || 3000,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CILENT_SECRET
};

const development = {
  db: process.env.DB,
  PORT: process.env.PORT || 3011,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CILENT_SECRET
};

module.exports =
  process.env.NODE_ENV === "production" ? production : development;
