//mapboxGL token
mapboxgl.accessToken = 'pk.eyJ1IjoidGhhcm1hMyIsImEiOiJjamkzazRtd3AyNWFyM2twZGpmNWp5Znh3In0.t0f4CwdP5o0wMM6adrU4Cg';

initialCenterPoint = [-73.906130,40.718147]
initialZoom = 11

// create an object to hold the initialization options for a mapboxGL map
var initOptions = {
  container: 'map-container', // put the map in this container
  style: 'mapbox://styles/mapbox/light-v10', // use this basemap
  center: initialCenterPoint, // initial view center
  zoom: initialZoom, // initial view zoom level (0-18)
};

// create the new map
var map = new mapboxgl.Map(initOptions);

// add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Load map and initialize layers
// Layers are initially hidden, and will change visual properties depending
// on what data source is selected for the map through the various buttons
map.on('style.load', function() {
  $('.legend').hide();
  $('.load-legend').show();

  // sets up the geojson as a source in the map
  map.addSource('census-data', {
    type: 'geojson',
    data: './data/census_data.geojson',
  });

  // let's make sure the source got added by logging the current map state to the console
  console.log(map.getStyle().sources)

  // initalize fill layer
  map.addLayer({
    id: 'tract-fill',
    type: 'fill',
    source: 'census-data',
    paint: {
      'fill-opacity': 0,
    }
  })

  // add census tract lines layer
  map.addLayer({
    id: 'typology-line',
    type: 'line',
    source: 'census-data',
    paint: {
      'line-opacity': 0,
      'line-color': 'black',
      'line-opacity': {
        stops: [
          [12, 0],
          [14.8, 1]
        ], // zoom-dependent opacity, the lines will fade in between zoom level 14 and 14.8
      }
    }
  });

  // // add an empty data source, which highlights the tract that a user clicks on
  map.addSource('highlight-feature', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  })

  // // add a layer for the highlighted tract boundary
  map.addLayer({
    id: 'highlight-line',
    type: 'line',
    source: 'highlight-feature',
    paint: {
      'line-width': 3,
      'line-opacity': 0,
      'line-color': 'red',
    }
  });

});

// when the user clicks on the census tract map, do...
map.on('click', function(e) {

  // selects the census tract features under the mouse
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['tract-fill'],
  });

  // get the first feature from the array of returned features.
  var tract = features[0]

  if (tract) { // if there's a tract under the mouse, do...
    map.getCanvas().style.cursor = 'pointer'; // make the cursor a pointer

    // lookup the corresponding description for the typology
    // var typologyDescription = tract.properties["typology"];
    var ntaName = tract.properties["NTAName"];

    // add popup to display typology of selected tract and detailed data
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<div id="popup" class="popup" style="z-index: 10;">` +
        '<b> Neighborhood: </b>' + NTAName + " </br>" +
        '<b> Total New Yorkers over 65: </b>' + numeral(tract.properties["over_65"]).format('0,0') + " </br>" +
        '<b> Total New Yorkers over 75: </b>' + numeral(tract.properties["over_75"]).format('0,0') + " </br>" +
        '<b> Total New Yorders over 85: </b>' + numeral(tract.properties["over_85"]).format('0,0') + " </br>" +
        '</div>'
      )
      .addTo(map);

    // set this tract's polygon feature as the data for the highlight source
    map.getSource('highlight-feature').setData(tract.geometry);
  } else {
    map.getCanvas().style.cursor = 'default'; // make the cursor default

    // reset the highlight source to an empty featurecollection
    map.getSource('highlight-feature').setData({
      type: 'FeatureCollection',
      features: []
    });
  }
});

//on button click, load map and legend for "All Tweets"
$('#button_over_65').on('click', function() {
  $('.legend').hide(); // hide all legend divs
  $('.over_65-legend').show(); // only show the legend for the corresponding data

  // set visual properties according the data source corresponding to the button
  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: 'over_65',
    stops: [
      [over_65_stops[0], over_65_colors[0]],
      [over_65_stops[1], over_65_colors[1]],
      [over_65_stops[2], over_65_colors[2]],
      [over_65_stops[3], over_65_colors[3]],
      [over_65_stops[4], over_65_colors[4]]
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "red");

});

//on button click, load map and legend for "Local Tweets"
$('#button_over_75').on('click', function() {
  $('.legend').hide();
  $('.over_75-legend').show();

  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: 'over_75',
    stops: [
      [over_75_stops[0], over_75_colors[0]],
      [over_75_stops[1], over_75_colors[1]],
      [over_75_stops[2], over_75_colors[2]],
      [over_75_stops[3], over_75_colors[3]],
      [over_75_stops[4], over_75_colors[4]]
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "grey");
});

//on button click, load map and legend for "Visitor Tweets"
$('#button_over_85').on('click', function() {
  $('.legend').hide();
  $('.over_85-legend').show();

  map.setPaintProperty('tract-fill', 'fill-opacity', 0.7);
  map.setPaintProperty('tract-fill', 'fill-color', {
    type: 'interval',
    property: 'over_85',
    stops: [
      [over_85_stops[0], over_85_colors[0]],
      [over_85_stops[1], over_85_colors[1]],
      [over_85_stops[2], over_85_colors[2]],
      [over_85_stops[3], over_85_colors[3]],
      [over_85_stops[4], over_85_colors[4]]
    ]
  });
  map.setPaintProperty('highlight-line', 'line-opacity', 0.8);
  map.setPaintProperty('highlight-line', 'line-color', "grey");
});
