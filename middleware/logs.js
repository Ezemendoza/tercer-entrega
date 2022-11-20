import  Log4js  from "log4js";

Log4js.configure({
  appenders: {
    miLoggerConsole: { type: "console" },
    warn: { type: "file", filename: "warn.log" },
    error: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["warn"], level: "warn" },
    info: { appenders: ["miLoggerConsole"], level: "info" },
    warn: { appenders: ["miLoggerConsole","warn"], level: "warn" },
    error: { appenders: ["miLoggerConsole", "error"], level: "error" },
  },
});
const loggerInfo = Log4js.getLogger("info");
const loggerWarn = Log4js.getLogger("warn");
const loggerError = Log4js.getLogger("error");
export {loggerInfo, loggerWarn, loggerError}