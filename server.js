const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: '.', dev });
const handle = app.getRequestHandler();
const router = require('./router');

app.prepare()
  .then(() => {
    const server = express();

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