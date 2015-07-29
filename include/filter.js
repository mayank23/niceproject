var filter = undefined;

$(function() {
  filter = {};

  var updateCostSlider = function(values) {
    $("#cost-slider-indicator").val("$" + values[0] + " - $" + values[1]);
    filter.cost = [values[0], values[1]];
  };
  $("#cost-slider").slider({
    range: true,
    min: 0,
    max: 500,
    values: [75, 300],
    slide: function(event, ui) {
      updateCostSlider(ui.values);
    }
  });
  updateCostSlider([75, 300]);

  var updateWealthIndicator = function(wealth) {
    var indicator;

    if (wealth === 0) {
      indicator = "very low wealth";
    } else if (wealth === 1) {
      indicator = "low wealth";
    } else if (wealth === 2) {
      indicator = "moderate wealth";
    } else if (wealth === 3) {
      indicator = "high wealth";
    } else if (wealth === 4) {
      indicator = "very high wealth";
    }

    console.log(indicator);
    filter.weatlh = wealth;
    $("#wealth-indicator").html(indicator);
  };

  $("#wealth-slider").slider({
    min: 0,
    max: 4,
    value: 2,
    slide: function(event, ui) {
      updateWealthIndicator(ui.value);
    }
  });
  updateWealthIndicator(3);
});
