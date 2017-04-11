const express = require("express");
var debug = require('debug')('app:server:wdc-router');
var devDebug = require('debug')('app:dev:wdc-router');
const router = express.Router();
const srcDir = "../src"
const callTaniumSoap = require(srcDir + "/taniumSoapConnect");
const checkQuestionStatus = require(srcDir + "/savedQuestions/checkQuestionStatus");
const returnQuestionResults = require(srcDir + "/savedQuestions/returnQuestionResults");
const returnQuestionList = require(srcDir + "/savedQuestions/returnQuestionList");
const returnQuestionSchema = require(srcDir + "/savedQuestions/returnQuestionSchema");


router
//Get All Users
.get("/", (req, res, next) => {
	var getAllQuestions = {command: "GetObject",object_list:{saved_questions:{}}};
	debug("Getting Question List");
	callTaniumSoap(getAllQuestions)
	.then(returnQuestionList)
	.then(function(data){
			res.send(data);
	})
})
.get("/:qid", (req, res, next) => {
	const { qid } = req.params;
	var askQuestion = {command: "GetObject",object_list:{saved_question:{"id": qid}}}
	debug("Getting Question ID: " + qid);
  if (!(/^\d+$/.test(qid))){
			next(Error("404 Error: You must use a Number for the ID"));
		} else {
			callTaniumSoap(askQuestion)
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
})
.get("/columns/:qid", (req, res, next) => {
	const { qid } = req.params;
	var askQuestion = {command: "GetObject",object_list:{saved_question:{"id": qid}}}
	debug("Getting Columns for Question ID: " + qid);
 		if (!(/^\d+$/.test(qid))){
			next(Error("404 Error: You must use a Number for the ID"));
		} else {
			callTaniumSoap(askQuestion)
			.then(returnQuestionSchema)
			.then(function(data){
			res.send(data);
		})
	}
})
.get("/resultinfo/:qid", (req, res, next) => {
	const { qid } = req.params;
	var questionResultInfo = {command: "GetResultInfo",object_list:{saved_question:{"id": qid}}}
	debug("Getting Result Info for Question ID: " + qid);
	if (!(/^\d+$/.test(qid))){
		next(Error("Error: You must use a Number for the ID"));
	} else {
	callTaniumSoap(questionResultInfo)
	.then(checkQuestionStatus)
	.then(function(data){
			res.send(data);
		})
	}
})
.get("/results/:qid", (req, res, next) => {
	const { qid } = req.params;
	var questionResults = {command: "GetResultData",object_list:{saved_question:{"id": qid}}}
	debug("Getting Results for Question ID: " + qid);
	if (!(/^\d+$/.test(qid))){
		next(Error("Error: You must use a Number for the ID"));
	} else {
	callTaniumSoap(questionResults)
	.then(returnQuestionResults)
	.then(function(data){
			if (data === "No Data") {
				next(Error("Error: No Data in Result Set"));
			} else {
			res.send(data);
		}
		})
	}
});

module.exports = router;
