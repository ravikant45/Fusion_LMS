import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { EApplicationEnvironment } from '../constants/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';

//Linking Trace Support
sourceMapSupport.install();

const consoleLogFormat = format.printf((info) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { level, message, timestamp, meta = {} } = info;

    const customLevel = level.toUpperCase();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const customTimeStamp = timestamp;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const customMessage = message;

    const customMeta = util.inspect(meta, {
        showHidden: false,
        depth: null
    });

    const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${'META'} ${customMeta}\n`;
    return customLog;
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.Console({
                level: 'info',
                format: format.combine(format.timestamp(), consoleLogFormat)
            })
        ];
    }
    return [];
};

const FileLogFormat = format.printf((info) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { level, message, timestamp, meta = {} } = info;

    const logMeta: Record<string, unknown> = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    for (const [key, value] of Object.entries(meta)) {
        if (value instanceof Error) {
            logMeta[key] = {
                name: value.name,
                message: value.message,
                stack: value.stack || ''
            };
        } else {
            logMeta[key] = value;
        }
    }

    const logData = {
        level: level.toUpperCase(),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        message,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        timestamp,
        meta: logMeta
    };

    return JSON.stringify(logData, null, 4);
});
const FileTransport = (): Array<FileTransportInstance> => {
    if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
        return [
            new transports.File({
                filename: path.join(__dirname, '../', '../', 'logs', `${config.ENV}.log`),
                level: 'info',
                format: format.combine(format.timestamp(), FileLogFormat)
            })
        ];
    }
    return [];
};

export default createLogger({
    defaultMeta: {
        meta: {}
    },
    transports: [...FileTransport(), ...consoleTransport()]
});
