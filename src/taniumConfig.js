var debug = require('debug')('app:server:tanium:config');
var devDebug = require('debug')('app:dev:tanium:config');
var Q = require("q");
var fs = require('fs');

exports.getConfig = function() {
	var input = fs.readFileSync('./t.config')
	var configVars = JSON.parse(input);
	var output = Q.defer();

	debug("Running taniumConfig");
	devDebug(configVars);
	if (configVars.taniumLoginPWD === "") {
		debug("No Login Password specified.");
		output.resolve({"error":"No Password in config file"})
	} else {
		output.resolve(configVars);
	}
	return output.promise;
};

exports.setConfig = function(input){
	debug("Setting Config")
	var output = Q.defer();
	// expectedInputSample = {
	// 	  "soap_endpoint_url":"https://mytaniumserver/soap",
	// 	  "taniumLogin" : "user",
	// 	  "taniumLoginPWD" : "password"
	// 	}
	debug(input);
	if (input.taniumLoginPWD2) {
		delete input.taniumLoginPWD2;
	}
	if ((!(input.soap_endpoint_url)) ||
			(input.soap_endpoint_url == "") ||
	 		(!(input.taniumLogin)) ||
			(input.taniumLogin == "") ||
	 		(!(input.taniumLoginPWD)) ||
			(input.taniumLoginPWD == "")
		) {
		output.resolve({"error":"You must specify the endpoint, login, and password"});
	} else {
		debug("Got config values")
		try {
			var currentConfig = fs.readFileSync('./t.config');
		} catch (err){
			if (err.code === 'ENOENT') {
			  debug('File not found!');
				currentConfig = currentConfig = '{"wsdl_path":"./wsdl/console.wsdl"}';
			} else {
			  throw err;
			}
		}
		if (String(currentConfig) === "") {
			debug("No Current Config");
			currentConfig = {"wsdl_path":"./wsdl/console.wsdl"};
		} else {
			debug("Existing Current Config")
			currentConfig = JSON.parse(currentConfig);
		}
		if (!(currentConfig.wsdl_path)) {
		input.wsdl_path = "./wsdl_path/console.wsdldefault"
		} else {
		input.wsdl_path = currentConfig.wsdl_path
		}

		fs.writeFile("./t.config", JSON.stringify(input,null,1), function(err) {
			if(err) {
					return Error(err);
			}
			debug("New Config Values Saved");
		});
		input.taniumLoginPWD = "**********"
		output.resolve(input);
	}
return output.promise;
}
