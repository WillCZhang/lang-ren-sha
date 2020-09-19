var express = require('express');
var router = express.Router();
let path = require('path');

const pages = path.join(__dirname + '/../public/pages/');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).sendFile(pages + "index.html");
});

router.get('/room/', (req, res, next) => {
  res.status(200).send("created!!!")
});

module.exports = router;
