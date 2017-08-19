'use strict'

import App from './server';
import routes from './routes'
import middleware from './middlewares/ErrorHandler';
import bodyParser from 'body-parser';
import Logger from './libs/logger'
import express from 'express';
import cors from 'cors';
import path from 'path';
import exphbs from 'express-handlebars';
const app = App.create();
const logger = Logger.create();

app.engine('handlebars', exphbs({
  layoutsDir: path.join(__dirname, '/public/views/layouts'),
  defaultLayout: 'main',
  helpers: null,
  partialsDir: [path.join(__dirname, '/public/views/partials')]
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/public/views'));

app.options('*', cors());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/api', routes);

app.use('/repo', routes);

app.use(middleware.errorHandler);

app.use((req, res) => {
  const err = new Error('Route not found');
  logger.error(err);
  res.send('404');
});