var debug = require('debug')('app:server:app');
var devDebug = require('debug')('app:dev:app');
var express = require('express');
var passport = require('passport')
var router = express.Router();
const srcDir = "../src"
const config = require(srcDir + "/taniumConfig");

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated()) {
    loginstatus = {LoginInfo: "You are Logged In"};
  } else {
    res.redirect("/login");
  }
  res.render("index", loginstatus);
})
.get("/login", (req, res, next) => {
  res.render("login")
})
.post("/login", function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render("login", {
      errorMsg: info.message
    })}
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
})
.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/")
  })
})
.get("/config", (req, res, next) => {
  config.getConfig().then(function(configvalues) {
  	res.render("config", {
      soap_endpoint_url:configvalues.soap_endpoint_url,
    });
  })
})
.post("/config", (req, res, next) => {
	config.setConfig(req.body)
	.then(function(){
			res.redirect("/");
	})
});
module.exports = router;
