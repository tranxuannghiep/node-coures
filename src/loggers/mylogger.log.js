const { createLogger, transports, format, level } = require("winston");
require('winston-daily-rotate-file');

const { v4: uuidv4 } = require("uuid")

class MyLogger {
    constructor() {
        const formatPrint = format.printf(({ timestamp, level, message, context, requestId, metadata }) => {
            return `${timestamp}::${level}::${context}::${requestId}::${message}::${JSON.stringify(metadata)}`;
        })

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true => lưu trữ file trước khi xóa bằng zip lại
                    maxSize: '20m',
                    maxFiles: '14d', // neu đặt thì sẽ xóa trong vòng 14 ngày
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'src/logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true, // true => lưu trữ file trước khi xóa bằng zip lại
                    maxSize: '20m',
                    maxFiles: '14d', // neu đặt thì sẽ xóa trong vòng 14 ngày
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                })
            ]
        })

    }

    commonParams(params) {
        let context, req, metadata;
        if (!Array.isArray(params)) {
            context = params
        } else {
            [context, req, metadata] = params;
        }

        const requestId = req?.requestId || uuidv4();
        return { context, metadata, requestId };
    }

    log(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramLog);
        this.logger.info(logObject);
    }

    error(message, params) {
        const paramLog = this.commonParams(params);
        const logObject = Object.assign({ message }, paramLog);
        this.logger.error(logObject);
    }
}

module.exports = new MyLogger();
