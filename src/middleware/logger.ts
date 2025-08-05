import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "cyan",
    http: "green",
    debug: "gray",
  },
};

winston.addColors(customLevels.colors);

const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp} ${level}]: ${stack || message}`;
});

const consoleTransport = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: "YY-MM-DD HH:mm:ss" }),
    logFormat
  ),
});

const fileTransport = new DailyRotateFile({
  filename: "logs/server-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info", // File logs from info and above
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
});

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [consoleTransport, fileTransport],
});

export default logger;
