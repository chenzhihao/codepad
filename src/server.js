const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({dir: './src', dev, quiet: false});
const handle = app.getRequestHandler();
const morgan = require('morgan');
const cors = require('cors');
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const apiRouter = require('./apiRouter');

app.prepare()
  .then(() => {
    let server = express();

    server.use(morgan('dev'));
    server.use(cors());
    server.options('*', cors());

    server.use(compression());

    server.use(bodyParser.urlencoded({extended: false}));
    server.use(bodyParser.json());

    server.use(cookieParser());
    server.use(methodOverride());

    server.use('/api', apiRouter);

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    let serverInstance = server.listen(process.env.npm_package_config_devPort, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:' + process.env.npm_package_config_devPort); //eslint-disable-line
    });

    let io = require('socket.io').listen(serverInstance);
    require('./socket/index')(io);
  });
