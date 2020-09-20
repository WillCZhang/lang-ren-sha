var express = require('express');
var router = express.Router();
let fs = require('fs');

const descriptions = JSON.parse(fs.readFileSync(__dirname + "/../appConfigs/descriptions.json").toString());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {descriptions: descriptions});
});

router.get('/room/', (req, res, next) => {
  res.status(200).send("created!!!")
});

module.exports = router;
