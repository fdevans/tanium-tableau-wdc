module.exports = function (bodyXml) {
  var debug = require('debug')('app:server:tanium:soapConnect');
  var devDebug = require('debug')('app:dev:tanium:soapConnect');
  var Q = require("q");
  var soap = require('strong-soap').soap;
  var config = require('./taniumConfig.js');
  var output = Q.defer();
  var result = "";
  debug("Running taniumSoapConnect");
  config.getConfig().then(function(config) {
    var url = config.wsdl_path;
    var login = {
      username: config.taniumLogin,
      password: config.taniumLoginPWD
    }
    devDebug("Full Config: \n" + JSON.stringify(config));
    if (config.error) {
      debug("FOUND ERROR IN CONFIG")
      output.resolve(config);
    } else {
      debug('SOAP EndPoint: ' + config.soap_endpoint_url);
      devDebug('WSDL: ' + config.wsdl_path);
      devDebug('Auth Info: ' + JSON.stringify(config.login));
      devDebug('Login: \n' + login);

    var requestArgs = {
      tanium_soap_request:{
        auth:{}
      }
    };
    requestArgs.tanium_soap_request = bodyXml;
    requestArgs.tanium_soap_request.auth = login;
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
