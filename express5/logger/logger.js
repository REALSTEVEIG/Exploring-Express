// //Logging

// const winston = require('winston')

// const options = {
//     file: {
//         level : 'info',
//         filename : './logs/app.logs',
//         handleExceptions : true,
//         json : true,
//         maxsize : 5242880,
//         maxfiles : 5,
//         colorize : false
//     },

//     console : {
//         level : "debug",
//         handleExceptions : true,
//         json : false,
//         colorize : false
//     }
// }

// const logger = winston.createLogger({
//     levels : winston.config.npm.levels,
//     transports : [
//         new winston.transport.File(options.file),
//         new winston.transport.Console(options.console)
//     ],
//     exitOnError : false
// })

// module.exports = logger

const { createLogger, format, transports } = require("winston");
 
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
 
const logger = createLogger({
  levels: logLevels,
  transports: [new transports.Console()],
});

module.exports = logger