var mapLocation = undefined;
var autocomplete = undefined;
var STARTVIEW = 0;
var MEDVIEW = 1;
var ENDVIEW = 2;
var currView = STARTVIEW;
var map = $("#map-canvas").gmap3("get");

var showMapView = function() {
  console.log("showmapview is called");
  $('#searching-mid').attr('id','searching-small');
  $('#search-submit-mid').attr('id','search-submit-small');
  $('#searchbox-mid').attr('id','searchbox-small');
  $('#mid').attr('id','finish');


  $("body").removeClass("medview")
    .addClass("mapview");

  recalcSize();
  $("#map-canvas").show().gmap3({
    map: {options: {zoom:12}}
  });
  if (mapLocation) {
    $("#map-canvas").gmap3("get").setCenter(mapLocation);
  }
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    $("#map-canvas").gmap3("get").setCenter(autocomplete.getPlace().geometry.location);
  });
  $("#side-bar").tabs();
  currView = ENDVIEW;
};

var recalcSize = function() {
  var mapWidth = $(window).width() - 400;
  var contentHeight = $(window).height() - 50;

  $("#map-canvas").width(mapWidth)
    .height(contentHeight);
  $(".side-bar").height(contentHeight);
  $("#sortable-filters").height(contentHeight - 52);
};

$(document).ready(function() {
  var input = (document.getElementById('searching-large'));
  console.log(input);
  autocomplete = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    mapLocation = autocomplete.getPlace().geometry.location;
    if (currView === STARTVIEW)
      showFilterView();
  });
  $("#go-to-mapview").click(showMapView);
  $("#sortable-filters").sortable();
  $("#sortable-filters").disableSelection();
  $("#search-submit-large").click(showFilterView);

  $("#sortable-filters").on("sortupdate", function() {
    console.log("it's go time");
    filter.price.priority = getPositionInRankings(".filter-price");
    filter.competitors.priority = getPositionInRankings(".filter-competitors");
    filter.providers.priority = getPositionInRankings(".filter-providers");
    filter.wealth.priority = getPositionInRankings(".filter-income");
    filter.walkscore.priority = getPositionInRankings(".filter-walkscore");
    filter.age.priority = getPositionInRankings(".filter-age");
    filter.population.priority = getPositionInRankings(".filter-population");
    filter.distance.priority = getPositionInRankings(".filter-distance");

    useUpdatedFilter();
  });
});

var showFilterView = function() {
  $('#searching-large').attr('id','searching-mid');
  $('#search-submit-large').attr('id','search-submit-mid');
  $('#searchbox-large').attr('id','searchbox-mid');
  $('#start').attr('id','mid');
  console.log("called or not");
  $("body").removeClass("startview")
      .addClass("medview");
  currView = MEDVIEW;
  return false;
};

function addCompetitorsToMap(competitors) {
    for (var i = 0; i < competitors; i++) {
        var latlng = new google.maps.LatLng(competitors[i].geometry.location.lat, competitors[i].geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            opacity: 1.0,
            /*icon: {
                url: 'push_pin.png',//'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|03D10C',
                anchor: new google.maps.Point(3, 28),
                //size of push pin
                scaledSize: new google.maps.Size(32 * Math.sqrt(Math.sqrt(size)) / 2, 32 * Math.sqrt(Math.sqrt(size)) / 2)
            },*/
            optimized: false,
            label: competitors[i].name
        });
    }
}

function addProvidersToMap(providers) {
    for (var i = 0; i < addCompetitorsToMap; i++) {
        var latlng = new google.maps.LatLng(providers[i].geometry.location.lat, providers[i].geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            opacity: 1.0,
            /*icon: {
                url: 'push_pin.png',//'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|03D10C',
                anchor: new google.maps.Point(3, 28),
                //size of push pin
                scaledSize: new google.maps.Size(32 * Math.sqrt(Math.sqrt(size)) / 2, 32 * Math.sqrt(Math.sqrt(size)) / 2)
            },*/
            optimized: false,
            label: providers[i].name
        });
    }
}

$(window).resize(recalcSize);

