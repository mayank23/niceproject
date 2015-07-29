
var request = require('request');

module.exports = function(req, res, next){
  
  var latitude = req.query.latitude;
  var longitude = req.query.longitude;
  var radius = req.query.radius;

  var url = 'http://www.catylist.com/jsp/common/ajax_provider.jsp?call=com.catylist.ajax.RealEstateSearchProvider.search(java.lang.Integer%200,java.lang.Integer%2050,java.lang.String%20null)&search2=true&center=' + latitude + '%2C' + longitude + '%7C' + radius + '&noCache=1438111652375';

 request(url, function(error, response, body){

   if(error){
     console.log(error);
   }else{
     res.setHeader('Content-Type','text/xml');
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:52096');
     res.send(body);
   }

   return next();

 });

};
