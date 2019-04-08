const fs = require("fs");
const app = require("./server");
const https = require("https");
const logger = require("./logger").logger;
const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");
/**
 * Get port from environment and store in Express.
 */

/**
 * Create HTTP server.
 */

const server = https.createServer({ key: privateKey, cert: certificate }, app);
server.listen(process.env.PORT, () =>
  logger.warn(
    `app is running at port: ${process.env.PORT} in ${
      process.env.NODE_ENV
    } mode`
  )
);

module.exports = server;
