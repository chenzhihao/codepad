const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dir: '.', dev});
const handle = app.getRequestHandler();
const morgan = require('morgan');
const path = require('path');
const _ = require('lodash');
const cors = require('cors');
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const router = require('./router');

app.prepare()
  .then(() => {
    const server = express();

    server.use(morgan('dev'));
    server.use(cors());
    server.options('*', cors());

    server.use(compression());

    server.use(bodyParser.urlencoded({extended: false}));
    server.use(bodyParser.json());

    server.use(cookieParser());
    server.use(methodOverride());

    server.use(router);

    server.get('/a', (req, res) => {
      return app.render(req, res, '/a', req.query)
    });

    server.get('*', (req, res) => {
      return handle(req, res)
    });

    server.listen(3000, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000')
    })
  });