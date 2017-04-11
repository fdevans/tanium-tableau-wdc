var debug = require('debug')('app:server:app');
var devDebug = require('debug')('app:dev:app');
var express = require('express');
var router = express.Router();
const srcDir = "../src"
const config = require(srcDir + "/taniumConfig");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("index");
})
.get("/config", (req, res, next) => {
	res.render("config");
})
.post("/config", (req, res, next) => {
	config.setConfig(req.body)
	.then(function(){
			res.redirect("/");
	})
});
module.exports = router;
