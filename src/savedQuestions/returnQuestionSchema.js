module.exports = function (input) {
  //input provided should be ResultXML From Soap Connector
  var debug = require('debug')('app:server:tanium:questionSchema');
  var devDebug = require('debug')('app:dev:tanium:questionSchema');
  debug("Running returnQuestionStatus");
  devDebug("Input:");
  devDebug(JSON.stringify(input,null,1));
  var Q = require("q");
  var output = Q.defer();
  if (input.error) {
    debug("Found an Error at Question Schema Input");
    output.resolve(input);
  } else {
    var outputList = [];
    var useSubColumns = false;
    var singleColumn = false;
    sensorList = input.result_object.saved_question.question.selects.select;
    devDebug("sensorList: \n"+JSON.stringify(sensorList, null, 1));
    devDebug("keys: " + Object.keys(sensorList));
    sensorListType = Object.prototype.toString.call(sensorList).slice(8, -1);
    devDebug("sensorListType: " + sensorListType);
    if (sensorListType === 'Array') {
      devDebug("sensorList is Array");
      numberOfSensors = sensorList.length;
    } else {
      devDebug("sensorList is NOT Array");
      numberOfSensors = 1;
    }
    devDebug("Number of Sensors: " + numberOfSensors);
    if (numberOfSensors === 1) {
      devDebug("Has SubColumns: " + sensorList.sensor.hasOwnProperty("subcolumns"))
      if (sensorList.sensor.hasOwnProperty("subcolumns")) {
        subColumnList = input.result_object.saved_question.question.selects.select.sensor.subcolumns.subcolumn;
        numberOfSubColumns = subColumnList.length;
        useSubColumns = true;
      }
      devDebug("useSubColumns: " + useSubColumns);
      if (useSubColumns === true) {
        columnList = subColumnList;
        numberOfColumns = numberOfSubColumns;
        devDebug("Number of table columns (sub): " + numberOfSubColumns);
      } else {
        useSubColumns = false;
        columnList = sensorList
        numberOfColumns = numberOfSensors;
        singleColumn = true;
      }
    }  else {
      useSubColumns = false;
      columnList = sensorList
      numberOfColumns = numberOfSensors;
    }
    devDebug(JSON.stringify(columnList,null,1));
    devDebug("Single Column: " + singleColumn);
    debug("Number of Columns: " + numberOfColumns);
    if (singleColumn) {
      outputList[0] = {"question": columnList.sensor.name};
    } else {
      for (x=0;x < numberOfColumns;x++ ) {
        if (useSubColumns == true) {
          outputList[x] = {"question": String(columnList[x].name)};
        } else {
          outputList[x] = {"question": columnList[x].sensor.name};
        }
      }
    }
    output.resolve(outputList);
  }
  return output.promise;
}
