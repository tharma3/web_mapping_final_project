// setting up arrays to store stops for displaying the data
var over_65_colors = ['#fff5f0', '#fdbea5', '#fc7050', '#d42020', '#67000d'];
var over_75_colors = ['#f7fcf5', '#caeac3', '#7bc87c', '#2a924a', '#00441b'];
var over_85_colors = ['#f7fbff', '#c8ddf0', '#73b3d8', '#2879b9', '#08306b'];

var over_65_stops = [0, 370, 739, 1370, 3305, 7634];
var over_75_stops = [0, 180, 385, 745, 2030, 3664];
var over_85_stops = [0, 49, 116, 225, 434, 963];


// Code for building legends for the age groups
for (var i=0; i<5; i++) {
  $('.legend-over_65').append(`
    <div>
      <div class="legend-color-box" style="background-color:${over_65_colors[i]};"></div>
      <span> ${over_65_stops[i]} - ${over_65_stops[i+1]-1} people </span>
    </div>
  `)

  $('.legend-over_75').append(`
    <div>
      <div class="legend-color-box" style="background-color:${over_75_colors[i]};"></div>
      <span> ${over_75_stops[i]} - ${over_75_stops[i+1]-1} people </span>
    </div>
  `)

  $('.legend-over_85').append(`
    <div>
      <div class="legend-color-box" style="background-color:${over_85_colors[i]};"></div>
      <span> ${over_85_stops[i]} - ${over_85_stops[i+1]-1} people </span>
    </div>
  `)
};
