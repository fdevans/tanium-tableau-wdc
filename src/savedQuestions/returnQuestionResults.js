
module.exports = function (input) {
	var debug = require('debug')('app:server:tanium:questionResults');
	var devDebug = require('debug')('app:dev:tanium:questionResults');
	var Q = require("q");
	var output = Q.defer();
	var parseString = require('xml2js').parseString;
	debug("Running returnQuestionResults");
	if (input.error) {
		debug("Found an Error at Question Schema Input");
		output.resolve(input);
	} else {
		var xml = input.ResultXML;
		var tableData = [];
		devDebug("Running returnQuestionResults");
		devDebug("Input: \n");
		devDebug(input);
		devDebug("ResultXML: \n");
		devDebug(xml);
		parseString(xml, function(err, result){
			if (err) {
				debug("Parse Error: " + err);
			}
			questionResults = result.result_sets.result_set[0];
		});
		devDebug("Question Results \n");
		devDebug(JSON.stringify(questionResults,null,1));
		if (questionResults.select_count == 0) {
			debug("No Results Found");
			tableData = "No Data"
		} else {
			var x = questionResults.rs[0].r;
			for (i = 0; i < x.length; i++) {
				rowData = [];
				for (y = 0; y < x[i].c.length; y++) {
					cellData = "";
					for (z = 0; z < x[i].c[y].v.length; z++) {
						cellData = cellData + x[i].c[y].v[z] + "\n";
					}
					cellData = cellData.replace(/\n$/, '');
					rowData[y] = cellData;
				}
				tableData[i] = rowData;
			}
			debug("Row Count: " + i);
			devDebug("Table Data");
			devDebug(tableData);
			//returns data as an array
		}
		output.resolve(tableData);
	}
	return output.promise;
}
