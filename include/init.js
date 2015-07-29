var mapLocation = undefined;
var autocomplete = undefined;
var STARTVIEW = 0;
var MEDVIEW = 1;
var ENDVIEW = 2;
var currView = STARTVIEW;

var showMapView = function() {
  console.log("showmapview is called");
  $('#searching-mid').attr('id','searching-small');
  $('#search-submit-mid').attr('id','search-submit-small');
  $('#searchbox-mid').attr('id','searchbox-small');
  $('#mid').attr('id','finish');


  $("body").removeClass("startview")
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
  var mapWidth = $(window).width() - 240;
  var contentHeight = $(window).height() - 50;

  $("#map-canvas").width(mapWidth)
    .height(contentHeight);
  $(".side-bar").height(contentHeight);
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
});

var showFilterView = function() {
  $('#searching-large').attr('id','searching-mid');
  $('#search-submit-large').attr('id','search-submit-mid');
  $('#searchbox-large').attr('id','searchbox-mid');
  $('#start').attr('id','mid');
  console.log("called or not");
  currView = MEDVIEW;
  return false;
};

$(window).resize(recalcSize);
