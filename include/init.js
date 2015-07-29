var mapLocation = undefined;
var autocomplete = undefined;
var STARTVIEW = 0;
var MEDVIEW = 1;
var ENDVIEW = 2;
var currView = STARTVIEW;
var map;
var markers = [];


var showMapView = function() {
  console.log("showmapview is called");
  $('#searching-mid').attr('id','searching-small');
  $('#search-submit-mid').attr('id','search-submit-small');
  $('#searchbox-mid').attr('id','searchbox-small');
  $('#mid').attr('id','finish');
    $('#filter-div').height("0px");


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
    $("#map-canvas").gmap3("get").setCenter(autocomplete.getPlace().geometry.location)
      useUpdatedLocation(autocomplete.getPlace());
  });
    map  = $("#map-canvas").gmap3("get");
  $("#side-bar").tabs();
  currView = ENDVIEW;

  $(".disable-filter").click(function(){
    var filterElem = $(this).closest("li");
    filterElem.removeClass("enabled")
        .addClass("disabled");
    filterElem.appendTo("#sortable-filters");
    reorderFilters();
  });

  $(".enable-filter").click(function() {
    var filterElem = $(this).closest("li");
    filterElem.removeClass("disabled")
        .addClass("enabled");
    filterElem.prependTo("#sortable-filters");
    reorderFilters();

  });
  reorderFilters();
    callMapFunction();
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

  $("#sortable-filters").on("sortupdate", reorderFilters);
  $("#button-submit").click(submitForm);
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
  $('#filter-div').height("inherit");
  return false;
};

function addCompetitorsToMap(competitors) {
    for (var i = 0; i < competitors.length; i++) {
        var latlng = new google.maps.LatLng(competitors[i].geometry.location.lat, competitors[i].geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            opacity: 1.0,
            icon: {
                url: '/css/img/competitoricon.png',
            },
            animation: google.maps.Animation.DROP,
        });
        markers.push(marker);
    }
}

function addProvidersToMap(providers) {
    for (var i = 0; i < providers.length; i++) {
        var latlng = new google.maps.LatLng(providers[i].geometry.location.lat, providers[i].geometry.location.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            opacity: 1.0,
            icon: {
                url: '/css/img/restaurantprovidericon.png'
            },
            animation: google.maps.Animation.DROP,
        });
        markers.push(marker);
    }
}

function addRealEstateToMap(locations) {
    for (var i = 0; i < locations.length; i++) {
        var latlng = new google.maps.LatLng(locations[i].propertyInfo.lat, locations[i].propertyInfo.lng);
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            draggable: false,
            icon: {
                url: '/css/img/realestateicon.png'
            },
            animation: google.maps.Animation.DROP,
        });
        markers.push(marker);
    }
}

function deleteMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

//delete table data, keep headers
function deleteTable() {
    $("tbody").children().remove();
    var table = document.getElementById("resultsTable");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = "Rank";
    cell2.innerHTML = "Details";
}

function fillTable(results) {
    deleteTable();
    var html = '<tr><th align="left">Rank</th><th align="left">Details</th></tr>';
    for (var i = 0; i < results.length; i++) {
        html += '<tr><td>' + parseInt((results[i].rank)) + '% Match</td><td>' + results[i].propertyInfo.address + '<br>' + results[i].propertyInfo.size + ' SF, $' + results[i].propertyInfo.price + 'per month</td></tr>';
    }

    $('#resultsTable tr').first(html).after(html);
    $('#resultsTable tr:first').remove();
}

var submitForm = function() {
  console.log("form is submitted");
  $("#filter-select li").each(function(child) {
    child = $(this);
    console.log("child!" + child.text());
    console.log(child);
    console.log(child.find("input"));
    if (!child.find("input").is(":checked")) {
      disableFilter(child.find("input").attr("filter"));
      console.log("disabled: " + child.find("input").attr("filter"));
    }
    else
      console.log("the child was enabled :)");
  });
  showMapView();
};

$(window).resize(recalcSize);



var disableFilter = function(filter) {
  console.log("gotta disable " + filter)
  var filterElem = $("." + filter);
  console.log(filterElem);
  filterElem.removeClass("enabled")
      .addClass("disabled");
  filterElem.appendTo("#sortable-filters");
};
