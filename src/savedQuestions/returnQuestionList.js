
module.exports = function (input) {
	var debug = require('debug')('app:server:tanium:questionList');
	var devDebug = require('debug')('app:dev:tanium:questionList');
	debug("Starting Return Question List");
	var Q = require("q");
	var output = Q.defer();
	var outputList = [];
	devDebug("Input:");
	devDebug(JSON.stringify(input,null,1));
	if (input.error) {
		debug("Found an Error at Question List Return Input");
		output.resolve(input.error);
	} else {
	// Check Question Status and return values.
	var questionList = input.result_object.saved_questions.saved_question;
	var numberOfQuestions = questionList.length;
	debug("Number of questions: " + numberOfQuestions);

	for (x=0;x < numberOfQuestions;x++ ) {
		outputList[x] = {
			"id": questionList[x].id,
			"question": questionList[x].name }
	}
	outputList.sort(function(a, b){
		if (a.question === b.question) {
        return 0;
    }
    else {
        return (a.question < b.question) ? -1 : 1;
    }
	})
// questionList = input;

	output.resolve(outputList);
}
	return output.promise;
}
