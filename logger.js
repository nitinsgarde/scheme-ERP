const winston = require('winston');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
 return `${timestamp} [${label}] ${level}: ${message}`;
});

var filename = module.filename.split('/').slice(-1);

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: filename }),
    timestamp(),
    myFormat,
    format.json()
  ),
  transports: [
    
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]

 });


module.exports = logger;

