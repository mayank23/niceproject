var restify = require('restify');
var path = require('path');

/* api implementations */
var placesImpl = require('./impl/places.js');

var server = restify.createServer({
  name: 'hackathon server',
  cors: true
});

server.listen(80,function(){
	console.log("server running");
});

/* api routes */
server.get('/places',placesImpl);





