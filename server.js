'use strict';

const express = require('express');
const requestIdInjector = require('express-request-id')({ headerName: 'jdeals-id' });
const logger = require('./libs/logger');
const WinstonContext = require('winston-context');

const app = express();


var mongoose = require('mongoose');

var db;

var app = express();

mongoose.connect('mongodb://moniv:12345678@ds139685.mlab.com:39685/bot_data_12', function(err, database) {
    if (err) {
        console.log(err);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

});


const logInjector = (req, res, next) => {
  req.log = new WinstonContext(logger.create(process.env.LOGSENE_TOKEN || 'dev-token'), '', { requestId: req.id, user_id: Math.random() }); // eslint-disable-line
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
  app.listen(PORT, () => { });

  return app;
};

const get = () => app;


module.exports = { create, get };
