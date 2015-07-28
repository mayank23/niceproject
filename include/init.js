var showMapView = function() {
  console.log("called");

  $("#top-filters").removeClass("top-filters-startview")
    .addClass("top-filters-mapview");
  $("#side-bar").removeClass("side-bar-startview")
    .addClass("side-bar-mapview");

  recalcSize();
  $("#map-canvas").show().gmap3();
};

var recalcSize = function() {
  var mapWidth = $(window).width() - 200;
  var contentHeight = $(window).height() - 50;

  $("#map-canvas").width(mapWidth)
    .height(contentHeight);
  $(".side-bar-mapview").height(contentHeight);
};

$(document).ready(function() {
  $("#go-to-mapview").click(showMapView);
});

$(window).resize(recalcSize);
