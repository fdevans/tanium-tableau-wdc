(function() {
	var myConnector = tableau.makeConnector();
	myConnector.getSchema = function(schemaCallback) {
		questionID = tableau.connectionData;
		var cols = [];
		$.getJSON('http://' + window.location.hostname + ":" + window.location.port + '/tanium/tableauWDC/columns/' + questionID, function(data){
			console.log(data);
			console.log("Number of Columns: " + data.length);
			for (i = 0; i < data.length; i++) {
				var colSetup = {
					id: data[i].question.replace(/ /g,"_"),
					alias: data[i].question,
					dataType: tableau.dataTypeEnum.string
				}
				cols[i] = colSetup;
			}
			cols[i++] = {
				id: "count",
				alias: "count",
				dataType: tableau.dataTypeEnum.float
			}
			var tableInfo = {
				id: "savedQuestion",
				alias: "Saved Question Results",
				columns: cols
			};
			schemaCallback([tableInfo]);
		})
	};
	myConnector.getData = function(table, doneCallback) {
		$.getJSON('http://' + window.location.hostname + ":" + window.location.port + '/tanium/tableauWDC/results/' + questionID, function(data){
			parseQuestionResultData(data);
		});

		function parseQuestionResultData(input) {
			tableData = input;
			table.appendRows(tableData);
			doneCallback();
		};
	}
	tableau.registerConnector(myConnector);

})();

setupData = function() {
	var questionID = $('#questionID').val().trim();
	console.log("qid from Setup Data: " + questionID);
	if (questionID) {
		console.log("got Question ID: " + questionID);
		tableau.authType = tableau.authTypeEnum.none;
		tableau.connectionData = questionID; //
		tableau.connectionName = "Tanium Saved Question";
		tableau.submit();
	}
};

$(document).ready(function() {
	$("#submitButton").click(function() {
		setupData();
	});
	$('#taniumForm').submit(function(event) {
		event.preventDefault();
		setupData();
	});

});
