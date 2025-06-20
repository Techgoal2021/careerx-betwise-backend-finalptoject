const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logLevel = process.env.LOG_LEVEL || 'info';

const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d'
});

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [dailyRotateFileTransport]
});

// 🟡 Add pretty console output in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

module.exports = logger;
