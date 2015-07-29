var filter = undefined;

$(function() {
  filter = {
    price: {val: [], priority: 8},
    competitors: {priority: 7},
    providers: {priority: 6},
    wealth: {val: 2, priority: 5},
    walkscore: {priority: 4},
    age: {val: 2, priority: 3},
    population: {priority: 2},
    distance: {priority: 1}
  };

  var updateCostSlider = function(values) {
    $("#cost-slider-indicator").val("$" + values[0] + " - $" + values[1]);
    filter.price.val = [values[0], values[1]];
    useUpdatedFilter();
  };
  $("#cost-slider").slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    stop: function(event, ui) {
      updateCostSlider(ui.values);
    }
  });
  updateCostSlider([75, 300]);

  var updateWealthIndicator = function(wealth) {
    var indicator;

    if (wealth === 0) {
      indicator = "Very Low Wealth";
    } else if (wealth === 1) {
      indicator = "Low Wealth";
    } else if (wealth === 2) {
      indicator = "Moderate Wealth";
    } else if (wealth === 3) {
      indicator = "High Wealth";
    } else if (wealth === 4) {
      indicator = "Very High Wealth";
    }

    console.log(indicator);
    filter.wealth.val = wealth;
    $("#wealth-indicator").html(indicator);
    useUpdatedFilter();
  };

  $("#wealth-slider").slider({
    min: 0,
    max: 4,
    value: 2,
    slide: function(event, ui) {
      updateWealthIndicator(ui.value);
    }
  });
  updateWealthIndicator(2);

  var updateAgeIndicator = function(age) {
    var indicator;

    if (age === 0) {
      indicator = "0 - 25";
    } else if (age === 1) {
      indicator = "26 - 32";
    } else if (age === 2) {
      indicator = "33 - 42";
    } else if (age === 3) {
      indicator = "43 - 55";
    } else if (age === 4) {
      indicator = "56+";
    }

    filter.age.val = age;
    $("#age-indicator").html(indicator);
    useUpdatedFilter();
  };

  $("#age-slider").slider({
    min: 0,
    max: 4,
    value: 2,
    slide: function(event, ui) {
      updateAgeIndicator(ui.value);
    }
  });
  updateAgeIndicator(2);
});

var getPositionInRankings = function(filterName) {
  return 8 - $(filterName).index("#sortable-filters li");
};

var useUpdatedFilter = function() {
  console.log(filter);
};