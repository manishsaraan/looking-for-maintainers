const app = require("./server");
const http = require("http");
const logger = require("./logger").logger;

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
server.listen(process.env.PORT, () =>
  logger.warn(
    `app is running at port: ${process.env.PORT} in ${
      process.env.NODE_ENV
    } mode`
  )
);

module.exports = server;
