var showMapView = function() {
  console.log("called");

  $("body").removeClass("startview")
    .addClass("mapview");

  recalcSize();
  $("#map-canvas").show().gmap3();
  $("#side-bar").tabs();
};

var recalcSize = function() {
  var mapWidth = $(window).width() - 240;
  var contentHeight = $(window).height() - 50;

  $("#map-canvas").width(mapWidth)
    .height(contentHeight);
  $(".side-bar").height(contentHeight);
};

$(document).ready(function() {
  var input = (document.getElementById('searching'));
  console.log(input);
  var autocomplete = new google.maps.places.Autocomplete(input);
  $("#go-to-mapview").click(showMapView);
  $("#sortable-filters").sortable();
  $("#sortable-filters").disableSelection();
});

$(window).resize(recalcSize);
