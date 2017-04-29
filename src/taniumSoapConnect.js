module.exports = function (bodyXml, sessionID, user, password) {
  var debug = require('debug')('app:server:tanium:soapConnect');
  var devDebug = require('debug')('app:dev:tanium:soapConnect');
  var Q = require("q");
  var soap = require('strong-soap').soap;
  var config = require('./taniumConfig.js');
  var session = require('express-session');
  var output = Q.defer();
  var result = "";

  debug("Starting taniumSoapConnect");
  config.getConfig().then(function(config) {
    debug("Got Config > Running taniumSoapConnect")
    var url = config.wsdl_path;
    devDebug("Full Config: \n" + JSON.stringify(config));
    if (config.error) {
      debug("FOUND ERROR IN CONFIG")
      output.resolve(config);
    } else {
      devDebug('SOAP EndPoint: ' + config.soap_endpoint_url);
      devDebug('WSDL: ' + config.wsdl_path);
      devDebug('sessionID: ' + sessionID)
      devDebug('Auth Info: ' + JSON.stringify(config.taniumLogin));
      devDebug('Login: \n' + JSON.stringify(login));
      var requestArgs = {
        tanium_soap_request:{
          auth:{},
          session:''
        }
      };
      requestArgs.tanium_soap_request = bodyXml;
      devDebug('requestArgs Body: ' + JSON.stringify(requestArgs));
      if (!(sessionID) || sessionID == "") {
        //Need to handle situation where user, password not provided either
        var login = {
            username: user,
            password: password
        }
        requestArgs.tanium_soap_request.auth = login;
        devDebug('requestArgs Auth: ' + JSON.stringify(requestArgs));
      } else {
        requestArgs.tanium_soap_request.session = sessionID;
        devDebug('requestArgs Session: ' + JSON.stringify(requestArgs));
      }
      var options = {endpoint: config.soap_endpoint_url};
      soap.createClient(url, options, function(err, client) {
        var didEmitEvent = false;
        client.setSecurity(new soap.ClientSSLSecurity(
          ''/*path to ssl key*/,
          ''/*path to ssl crt*/,
          {strictSSL: false, rejectUnauthorized: false} /*default set to ignore ssl issues*/
        ));
        client.on('request', function (xml) {
          didEmitEvent = true;
          devDebug('SOAP Request XML: ' + xml + '\n');
        });
        var method = client["TaniumSOAPService"]["TaniumSOAPPort"]["Request"];
        method(requestArgs, function(err, result, envelope, soapHeader) {
          devDebug('Request Args: ' + JSON.stringify(requestArgs, null, 2))
          devDebug('SOAP Error: \n' + err + '\n');
          devDebug('SOAP Header: \n' + soapHeader + '\n');
          devDebug('SOAP Response Envelope: \n' + envelope + '\n');
          devDebug('Result: \n' + JSON.stringify(result, null, 3) + '\n');
          output.resolve(result);
        });
      });
    }
      result = "";
    });
    return output.promise;
  };
