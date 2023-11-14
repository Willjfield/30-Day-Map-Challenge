import maplibregl from 'maplibre-gl';
import turf from 'turf';
import axios from 'axios';
const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'assets/outdoor-nolabels.json',
  hash: true,
  antialias: true,
  center: [0, 0], // starting position
  zoom: 3// starting zoom
});

const origin = [-100.57576507949179, 38.51753746074036];

const destination = [23.78060124807601, 9.394367629478097];

map.on('load', async () => {
  let importDat = await axios('assets/africai.csv');
  let importData = importDat.data;
  const cleanImportData = importData.split(',').map(x => +x).filter(x => !isNaN(x));

  let exportResp = await axios('assets/africae.csv');
  let exportData = exportResp.data;
  const cleanExportData = exportData.split(',').map(x => +x).filter(x => !isNaN(x));

  const originPoint = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [origin[0], origin[1]-2]
        }
      }
    ]
  };
  
  const destinationPoint = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [destination[0], destination[1]+2]
        }
      }
    ]
  }

  map.addSource('originPoint', {
    'type': 'geojson',
    'data': originPoint
  });

  map.addLayer({
    'id': 'op',
    'source': 'originPoint',
    'type': 'circle',
    'paint': {
      'circle-radius': 10,
      'circle-color': '#bf007c'
    }
  });

  map.addSource('dPoint', {
    'type': 'geojson',
    'data': destinationPoint
  });

  map.addLayer({
    'id': 'dp',
    'source': 'dPoint',
    'type': 'circle',
    'paint': {
      'circle-radius': 10,
      'circle-color': '#007cbf'
    }
  });

  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates':  [[origin[0],origin[1]+2], [destination[0],destination[1]+2]]
        }
      }
    ]
  };

  const routeExport = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[origin[0],origin[1]-2], [destination[0],destination[1]-2]]
        }
      }
    ]
  };

  // Calculate the distance in kilometers between route start/end point.
  const lineDistance = turf.lineDistance(route.features[0], 'kilometers');
  const lineExportDistance = turf.lineDistance(routeExport.features[0], 'kilometers');

  const arc = [];
  const arcExport = [];
  // Number of steps to use in the arc and animation, more steps means
  // a smoother arc and animation, but too many steps will result in a
  // low frame rate
  const steps = 5000;

  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i, 'kilometers');
    arc.push(segment.geometry.coordinates);
  }

  for (let i = 0; i < lineExportDistance; i += lineExportDistance / steps) {
    const segmentExport = turf.along(routeExport.features[0], i, 'kilometers');
    arcExport.push(segmentExport.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = arc;
  routeExport.features[0].geometry.coordinates = arcExport;
  // Used to increment the value of the point measurement against the route.
  let counter = 0;


  map.addSource('route', {
    'type': 'geojson',
    'data': route
  });

  map.addLayer({
    'id': 'route',
    'source': 'route',
    'type': 'line',
    'paint': {
      'line-width': 2,
      'line-color': '#007cbf'
    }
  });

  map.addSource('route-export', {
    'type': 'geojson',
    'data': routeExport
  });

  map.addLayer({
    'id': 'route-exp',
    'source': 'route-export',
    'type': 'line',
    'paint': {
      'line-width': 2,
      'line-color': '#bf007c'
    }
  });

  let month = 0;

  setInterval(() => {
    month++;
    if(month > cleanImportData.length){
      month = 0;
    }
    map.setPaintProperty('route', 'line-width',cleanImportData[month]/250);
    map.setPaintProperty('route-exp', 'line-width',cleanExportData[month]/250);

    let year = 1997+Math.floor(month/12);
    let mon = (month%12)+1;
    document.getElementById('year').innerHTML = year;
    document.getElementById('month').innerHTML = mon;
  },50)



});


