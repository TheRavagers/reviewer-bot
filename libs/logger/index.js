'use strict';
const winston = require('winston');
//const logsene = require('winston-logsene');
const ConsoleLogger = require('./console-logger');
const rootPath = require('app-root-path');

let serviceVersion;

try {
  serviceVersion =
  require(`${rootPath}/version.json`).version; // eslint-disable-line global-require
} catch (err) {
  serviceVersion = 'unknown';
}

let logger = null;
const serviceName = process.env.npm_package_name || 'TEST';

function create(token, tags) {
  if (logger) return logger;

  let rewriter = null;

  if (tags && tags[0]) {
    rewriter = (level, msg, metadata) => {
      const meta = metadata;
      const existingTags = meta.tags || [];
      meta.tags = existingTags.concat( tags );
      return meta;
    };
  }

  const serviceInjector = (level, msg, metadata) => {
    const meta = metadata;
    meta.serviceName = serviceName;
    meta.version = serviceVersion;
    return meta;
  };

  logger = new winston.Logger({
    rewriters: [serviceInjector]
  });

  logger.add(ConsoleLogger, {
    level: 'debug'
  });


  // it will be usefull for production

  // if (process.env.NODE_ENV === 'production') {
  //   logger.add(logsene, {
  //     token,
  //     rewriter
  //   });
  // }

  return logger;
}

module.exports = { create };
