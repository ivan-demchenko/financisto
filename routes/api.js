var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ type: 'application/json'});
var transformer = require('../service/main');

router.post('/csv', jsonParser, (req, res, next) => {
  res.json(transformer(req.body.csv));
});

module.exports = router;
