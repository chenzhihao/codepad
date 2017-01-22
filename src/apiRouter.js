const express = require('express');
let apiRouter = express.Router();
apiRouter.get('/test', (req, res) => res.json({status: 200, message: 'ok'}));

module.exports = apiRouter;
