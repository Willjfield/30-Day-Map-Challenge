import maplibregl from 'maplibre-gl';
import hike from './assets/hike_data.json';
const map = new maplibregl.Map({
  container: 'map', // container id
  style: {
    "version": 8,
    "name": "hike",
    "sources": {
      "hike-src": {
        "type": "geojson",
        "data": hike
      },
    },
    "layers": [{
      "id": "hike",
      "type": "line",
      "source": "hike-src"
    }]
  },
  hash: true,
  center: [-74.25945, 40.72601], // starting position
  zoom: 9 // starting zoom
});

function pointOnPath(tick) {
  const speed = 20;

  const modTick = (tick/speed)%(hike.features[0].geometry.coordinates.length-1);


  let idx = Math.floor(modTick);

  const coords = hike.features[0].geometry.coordinates[idx];
  const coords_next = hike.features[0].geometry.coordinates[idx + 1];
 
  const lerpAmnt = modTick % 1;
  console.log(lerpAmnt)
  const lerp_lat = coords[0] + (coords_next[0] - coords[0]) * lerpAmnt;

  const lerp_lon = coords[1] + (coords_next[1] - coords[1]) * lerpAmnt;

  return {
    'type': 'Point',
    'coordinates': [lerp_lat, lerp_lon]
  };
}

map.on('load', () => {
  // Add a source and layer displaying a point which will be animated in a circle.
  map.addSource('point', {
    'type': 'geojson',
    'data': pointOnPath(0)
  });

  map.addLayer({
    'id': 'point',
    'source': 'point',
    'type': 'circle',
    'paint': {
      'circle-radius': 5,
      'circle-color': '#fff0',
      'circle-stroke-width': 1,
      'circle-stroke-color': '#000'
    }
  });

  function animateMarker(timestamp) {
    // Update the data to a new position based on the animation timestamp. The
    // divisor in the expression `timestamp / 1000` controls the animation speed.
    map.getSource('point').setData(pointOnPath(timestamp));
    //  console.log(pointOnPath(timestamp).coordinates)
    // Request the next frame of the animation.
    requestAnimationFrame(animateMarker);
  }

  // Start the animation.
  animateMarker(0);
});


