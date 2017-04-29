var debug = require('debug')('app:server:passport');
var devDebug = require('debug')('app:dev:passport');
const srcDir = "./src"
const callTaniumSoap = require(srcDir + "/taniumSoapConnect");
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
passport.use(new LocalStrategy(authenticate))

function authenticate(user, password, done){
  var getAllObjects = {command: "GetObject",object_list:{users:{}}};
  debug("Initial Login");
  devDebug("User: " + user);
  devDebug("Password: " + password);
  callTaniumSoap(getAllObjects, "", user, password)
    .then((output) => {
      if (!output.session) {
        debug("Found Error During Auth")
        return done(null, false, {message: "Login Failed"});
      }
      debug("Auth Succeeded")
      done(null, output)
    }, done)
}

passport.serializeUser(function(output, done) {
  done(null, output.session)
})

passport.deserializeUser(function(id, done){
  done(null, id)
})
