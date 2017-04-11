
module.exports = function (input) {
	var debug = require('debug')('app:server:tanium:questionStatus');
	var devDebug = require('debug')('app:dev:tanium:questionStatus');
	debug("Starting Check Question Status");
	var Q = require("q");
	var output = Q.defer();
	var parseString = require('xml2js').parseString;
	var percentComplete = new Number();
	var resultDone = {};
	if (input.error) {
		debug("Found an Error at Question Status Input");
		output.resolve(input);
	} else {
		devDebug("Input:");
		devDebug(input);
		// Check Question Status and return values.
		var xml = input.ResultXML;
		devDebug(xml);
		parseString(xml, function(err, result){
			if (err) {
				console.log("Parse Error: " + err);
			}
			questionStatus = result.result_infos.result_info[0];
		});
		est_total = questionStatus.estimated_total[0];
		passed = questionStatus.mr_passed[0];
		devDebug("est_total: " + est_total);
		devDebug("passed: " + passed);
		if (est_total === passed && est_total != 0) {
			resultDone = {"status":"Results are Ready"};
		} else if (est_total != 0) {
			if (passed < est_total){
			percentComplete = Math.floor((passed/est_total) * 100);
			resultDone = {"status":"Still Gathering Results - " + percentComplete + "%"};
			} else {
				resultDone = {"status":"Gathering Results"};
			}
		} else {
			resultDone = {"status":"No results for this question"}
		}
		debug("Estimated Total: " + est_total)
		debug("MR_Passed Total: " + passed);
		devDebug("Results Done: " + JSON.stringify(resultDone,null,1));
		output.resolve(resultDone);
	}
	return output.promise;
}
