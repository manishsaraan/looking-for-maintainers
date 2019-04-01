const winston = require("winston");
module.exports.logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ],
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.simple(),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.prettyPrint()
  )
});
