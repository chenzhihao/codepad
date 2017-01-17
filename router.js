let express = require('express');
let router = express.Router();

router.get('/api', function(req, res, next) {
  res.send('api');
});

module.exports = router;