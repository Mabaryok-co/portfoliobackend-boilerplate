const winston = require("winston");
const dailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const config = require("@config");

const logDir = path.join(__dirname, "../../logs");

const datePattern = (Freq) => {
  switch (Freq) {
    case "daily":
      return "YYYY-MM-DD";
    case "hourly":
      return "YYYY-MM-DD HH:mm";
    default:
      return "YYYY-MM-DD";
  }
};

//Log level default by Winston. Low to High priority
const defaultLevel = [
  "silly",
  "debug",
  "verbose",
  "http",
  "info",
  "warn",
  "error",
];

//Minimum log level. Default are info. so only priority greater than or equal than info
const minLogLevel = config.log.level;

//Slicing index that is lower than minLogLevel index
const logLevel = defaultLevel.slice(defaultLevel.indexOf(minLogLevel));

const createDailyTransportFile = (level) => {
  return new dailyRotateFile({
    level: level,
    filename: `${level}-%DATE%.log`,
    dirname: logDir,
    datePattern: datePattern(config.log.freq),
    maxSize: `${config.log.maxSize}m`,
    maxFiles: `${config.log.maxAge}d`,
  });
};

//Creating diffrent file for log based on the level
const logTransport = logLevel.map((level) => createDailyTransportFile(level));

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: minLogLevel,
  format: winston.format.combine(
    enumerateErrorFormat(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: datePattern("hourly") }),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} - [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
    ...logTransport,
  ],
});

module.exports = logger;
