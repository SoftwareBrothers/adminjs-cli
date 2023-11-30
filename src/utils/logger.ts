import pino from 'pino';

const logger = pino.default({
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname,time',
    },
  },
});

export default logger;
