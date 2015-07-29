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
  $("#go-to-mapview").click(showMapView);
});

$(window).resize(recalcSize);
