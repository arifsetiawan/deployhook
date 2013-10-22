
var express = require('express');

var config = require('./lib/config.js');
var deploy = require('./lib/deploy.js');

var app = express();
app.use(express.basicAuth('YOURNAME', 'YOURPASSWORD'));
app.use(express.bodyParser());

app.configure('development', function () {
  app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.get(config.rootPath, function(req, res) {
  res.send('Deploy POST Hook ready !!')
});

// get is for my local tests
app.get(config.rootPath + '/deploy/hook', function(req, res) { deploy.getHook(req, res); });

// set this url in POST hook setting in your repository
app.post(config.rootPath + '/deploy/hook', function(req, res) { deploy.postHook(req, res); });

app.listen(config.port);
console.log('App is running on port : ' + config.port);
