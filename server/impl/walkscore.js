var request = require('request');

module.exports = function(req, res, next){

var address = req.query.address;
var url = 'https://www.walkscore.com/auth/_pv/overview/' + address + '?d=current';

request(url, function(error, response, body){
  if(error){
    console.log(error);
  }else{
         
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:52096');
    res.send(body);
  }
  return next();
});

}