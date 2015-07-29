var restify = require('restify');
var path = require('path');

/* api implementations */
var i = './impl';
var places = require(i + '/places.js');
var catylist = require(i + '/catylist.js');
var walkscore = require(i+ '/walkscore.js');

var server = restify.createServer({
  name: 'hackathon server'
});
server.use(restify.queryParser());
server.listen(80,function(){
	console.log("server running");
});

/* api routes */
server.get('/places', places);
server.get('/catylist', catylist);
server.get('/walkscore', walkscore);
