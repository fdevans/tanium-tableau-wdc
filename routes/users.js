const express = require("express");
var debug = require('debug')('app:server:users-router');
var devDebug = require('debug')('app:dev:users-router');
const router = express.Router();
const passport = require("passport");
const srcDir = "../src"
const callTaniumSoap = require(srcDir + "/taniumSoapConnect");

function loginRequired(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.redirect("/login")
	}
	next()
}

router
//Get All of this object
	.get("/", loginRequired, (req, res, next) => {
			var getAllObjects = {command: "GetObject",object_list:{users:{}}};
			debug("Getting All Users");
			callTaniumSoap(getAllObjects, req.session.passport.user)
			.then(function(data){
					res.send(data);
					debug("User Data Sent");
			})
	})
	//Get Specific Object by ID
	.get("/:qid", loginRequired, (req, res, next) => {
			const { qid } = req.params;
			var getObject = {command: "GetObject",object_list:{user:{"id": qid}}}
			debug("Getting User ID: " + qid);
		  if (!(/^\d+$/.test(qid))){
					next(Error("404 Error: You must use a Number for the ID"));
				} else {
					callTaniumSoap(getObject, req.session.passport.user)
					.then(function(data){
						if (data.error) {
							next(Error("Error in config file"));
						} else	if (data.command.startsWith("ERROR:")){
								debug("Command Error")
								next(Error("404 Error: SOAP Command Error" ));
							} else {
								res.send(data);
							}
					})
			}
	});

module.exports = router;
