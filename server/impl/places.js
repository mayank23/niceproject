var request = require('request');

module.exports = function(req, res, next){

  var key = 'AIzaSyCTJ_ZzCJZcaENsT0YZLo-MwP6BpJH291g';
  var query = req.query.query;

  var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?key=' + key + '&' + 'query=' + query;

  request(url, function(error, response, body){
    if(error)
    {
      console.log(error);
    }else{
     res.setHeader('Content-Type', 'application/json');
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:52096');
     res.send(body);
    }
    return next();

  });

}