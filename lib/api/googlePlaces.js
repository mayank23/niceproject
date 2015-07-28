/* Google Places Javascript Api */

var apiKey = 'AIzaSyCTJ_ZzCJZcaENsT0YZLo-MwP6BpJH291g';
var textSearchBaseUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';

var googlePlaces = {
  placesNearAddr: function(addr){
    var req = urlWithGetParams(textSearchBaseUrl,{
      key: apiKey,
      query: addr
    });

    $.get( req, function( data ) {
      console.log(data);
    }, "json" );
  }
};

function urlWithGetParams(base, paramsObject){

  var url = base + '?';

  for(property in paramsObject){
    if(paramsObject.hasOwnProperty(property)){
      url += '&' + property + '=' + paramsObject[property];
    }
  }

  return encodeURIComponent(url);
  
}
