var resultsMarkers = [];

var populateResults = function(results) {
    resultsMarkers.map(deleteMarker);

    resultsMarkers = results.map(createResultMarker);


};

var renderResult = function(result) {

};


var competatorMarkers = [];

var populateCompetators = function(competators) {
    competatorMarkers.map(deleteMarker);

    competatorMarkers = competators.map(createCompetatorMarker);
};

var createCompetatorMarker = function(competator) {
    return new google.maps.Marker({
        title: competator.name,
        map: $("#map-canvas")
    });
};

var deleteMarker = function(marker) {
  marker.setMap(null);
};