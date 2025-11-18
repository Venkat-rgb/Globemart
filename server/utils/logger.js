import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

export const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf((info) => `[${info.timestamp}] [${info.level}] ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});
