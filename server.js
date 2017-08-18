'use strict';

const express = require('express');
const requestIdInjector = require('express-request-id')({ headerName: 'jdeals-id' });
const logger = require('./libs/logger');
const WinstonContext = require('winston-context');

const app = express();

const logInjector = (req, res, next) => {
  req.log = new WinstonContext(logger.create(process.env.LOGSENE_TOKEN || 'dev-token'), '', {requestId: req.id, user_id:Math.random()}); // eslint-disable-line
  req.log.info(
    `Incoming ${req.method} request to ${req.path}`,
    {
      requestMethod: req.method,
      requestPath: req.path,
      requestBody: req.body,
      requestQuery: req.query,
      requestParam: req.params,
      requestHeaders: req.headers
    }
  );
  next();
};

const create = (port) => {
  const PORT = port || 9999;
  app.use(requestIdInjector);
  app.use(logInjector); // LogInjector must follow requestIdInjector

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept,' +
      'Cache-Control, atlas-token, Access-Control-Allow-Origin');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT, PATCH');
    next();
  });
  app.listen(PORT, () => {});

  return app;
};

const get = () => app;


module.exports = { create, get };
