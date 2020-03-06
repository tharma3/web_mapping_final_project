mapboxgl.accessToken = 'pk.eyJ1IjoidGhhcm1hMyIsImEiOiJjamkzazRtd3AyNWFyM2twZGpmNWp5Znh3In0.t0f4CwdP5o0wMM6adrU4Cg';

var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 11,
center: [-74.012489,40.707970]
});

map.on('load', function() {

  var layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

  for (i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }

  map.addSource('under_5', {
    type: 'geojson',
    data: 'mapbox://mapbox.2opop9hr'
  });

  map.addLayer({
    'id': 'museums',
    'type': 'circle',
    'source': 'museums',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      'circle-radius': 8,
      'circle-color': 'rgba(55,148,179,1)'
    },
    'source-layer': 'museum-cusco'
  });


  map.addSource('contours', {
    type: 'vector',
    url: 'mapbox://mapbox.mapbox-terrain-v2'
  });

  map.addLayer({
    'id': 'contours',
    'type': 'line',
    'source': 'contours',
    'source-layer': 'contour',
    'layout': {
      'visibility': 'visible',
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#877b59',
      'line-width': 1
    }
  });

});

var toggleableLayerIds = ['contours', 'museums'];

for (var i = 0; i < toggleableLayerIds.length; i++) {

  var id = toggleableLayerIds[i];

  var link = document.createElement('a');
  link.href = '#';
  link.className = 'active';
  link.textContent = id;

  link.onclick = function(e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

  var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

  if (visibility === 'visible') {
    map.setLayoutProperty(clickedLayer, 'visibility', 'none');
    this.className = '';
  } else {
    this.className = 'active';
    map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
  }

  };

  var layers = document.getElementById('menu');
  layers.appendChild(link);

  map.on('mousemove', function(e) {
  var states = map.queryRenderedFeatures(e.point, {
    layers: ['statedata']
  });

  if (states.length > 0) {
    document.getElementById('pd').innerHTML = '<h3><strong>' + states[0].properties.name + '</strong></h3><p><strong><em>' + states[0].properties.density + '</strong> people per square mile</em></p>';
  } else {
    document.getElementById('pd').innerHTML = '<p>Hover over a state!</p>';
  }
});
}
