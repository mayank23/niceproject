var showMapView = function() {
  console.log("showmapview is called");
  $('#searching-mid').attr('id','searching-small');
  $('#search-submit-mid').attr('id','search-submit-small');
  $('#searchbox-mid').attr('id','searchbox-small');
  $('#mid').attr('id','finish');


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
  var input = (document.getElementById('searching-large'));
  console.log(input);
  var autocomplete = new google.maps.places.Autocomplete(input);
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
  console.log("called");
};
$(window).resize(recalcSize);
