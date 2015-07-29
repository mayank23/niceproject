/* Google Places Javascript Api */

var textSearchBaseUrl = 'http://10.22.253.245/places';

var googlePlaces = {
  placesNearAddr: function(addr, callback){
    var req = urlWithGetParams(textSearchBaseUrl,{
      query: addr
    });

    $.support.cors = true;
    
    $.ajax({
      url: req,
      dataType: 'json',
      success: function(data){
        console.log(JSON.parse(data));
      },
      contentType: 'application/json'
    });



  }
};



function urlWithGetParams(base, paramsObject){

  var url = base + '?';

  for(property in paramsObject){
    if(paramsObject.hasOwnProperty(property)){
      url += property + '=' + paramsObject[property] + '&';
    }
  }

  return url;

}
