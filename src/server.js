const express = require('express');
const next = require('next');
const uuid = require('uuid/v4');

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

const changesets = require('changesets');
const Changeset = changesets.Changeset;

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

    server.get('/a', (req, res) => {
      return app.render(req, res, '/a', req.query);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    let serverInstance = server.listen(process.env.npm_package_config_devPort, (err) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:' + process.env.npm_package_config_devPort); //eslint-disable-line
    });


    let io = require('socket.io').listen(serverInstance);

    let usersMap = new Map();
    let text = '';

    io.on('connection', function (socket) {
      const userId = uuid();
      usersMap.set(userId, {});
      console.log('a user connected:', userId);
      socket.emit('initialization', {userId, text});

      socket.on('changeSet', function (changeSetPack) {
        const changeSet = Changeset.unpack(changeSetPack);
        text = changeSet.apply(text);
        console.log(text);
        socket.broadcast.emit('changes', {changeSetPack, from: userId});
      });

      socket.on('disconnect', function () {
        console.log('user disconnected');
      });
    });
  });
