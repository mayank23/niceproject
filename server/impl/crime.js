var request = require('request');

module.exports = function(req, res, next){
  
 var state2c = req.query.state2c;
 var city = req.query.city;

 var url = 'http://www.neighborhoodscout.com/' + state2c + '/' + city + '/crime/';

 request(url, function(error, response, body){

   if(error){
     console.log(error);
   }else{
     
    res.setHeader('Content-Type', 'text/plain');
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:52096');
     var idx = body.indexOf('value\'>');

     var start = idx+7;
     
     var end = start + 4;
     if(body[end-1]==='<')
     {
      end--;
     }

     var crimeRate = body.substring(start,end);
     var obj = {
      crimeRate: parseInt(crimeRate)
     };
     res.send(JSON.stringify(obj));


  }

   return next();

 });

};
