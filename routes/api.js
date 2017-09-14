var express = require('express');
var router = express.Router();

var transformer = require('../service/main');

router.post('/csv', (req, res, next) => {
  console.log(req.body);
  res.json(transformer(req.body.csv));
});

module.exports = router;
