const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');

const {combine, timestamp, label, printf} = winston.format;

//log파일 저장 경로
const logDirectory = `${process.cwd()}/logs`;

//로그 출력 포맷 방식
const logFormat = printf(({level, message, label, timestamp})=>{
    return `${timestamp} [${label}] ${level}: ${message}`;
});

//로그 생성 함수
const logger = winston.createLogger({

    //로그 출력 방식
    format: combine(
        timestamp({format : 'YYYY-MM-DD HH:mm:ss'}),
        label({label : 'bookCalander 관리자 어플리케이션'}),
        logFormat,
    ),

    //실제 로그 기록 방식
    transports: [
        
        //error 레벨 로그 기록 방식
        new winstonDaily({
            level: 'error',
            datePattern : 'YYYYMMDD',
            dirname : logDirectory,
            filename : `%DATE%.log`,
            maxFiles : 30,
            zippedArchive : false,
        }),

        //warn 레벨 로그 기록 방식
        new winstonDaily({
            level: 'warn',
            datePattern : 'YYYYMMDD',
            dirname : logDirectory,
            filename : `%DATE%.log`,
            maxFiles : 30,
            zippedArchive : false,
        }),

        //info 레벨 로그 기록 방식
        new winstonDaily({
            level: 'info',
            datePattern : 'YYYYMMDD',
            dirname : logDirectory,
            filename : `%DATE%.log`,
            maxFiles : 30,
            zippedArchive : false,
        }),

        //debug 레벨 로그 기록 방식
        new winstonDaily({
            level: 'debug',
            datePattern : 'YYYYMMDD',
            dirname : logDirectory,
            filename : `%DATE%.log`,
            maxFiles : 30,
            zippedArchive : false,
        }),
    ],
})

module.exports = logger;