import maplibregl from 'maplibre-gl';
import maplewood from './assets/pest_4326.json';
import MapLibreShaderLayer from './ShaderLayer';
import frag from './assets/frag.glsl';

const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'assets/osm_liberty.json',
  hash: true,
  antialias: true,
  center: [-74.25945, 40.72601], // starting position
  zoom: 9 // starting zoom
});



map.on('load', () => {
  // Add a source and layer displaying a point which will be animated in a circle.
  map.addSource('mapwd-src', {
    'type': 'geojson',
    'data': maplewood
  });

  map.addLayer({
    'id': 'maplewood',
    'source': 'mapwd-src',
    'type': 'fill',
    'paint': {
      'fill-color': '#000000',
      'fill-opacity': 0.5
    },
    filter: ['all', ['!=', ['get', 'PEST_USE'], 'N'], ['!=', ['get', 'PEST_USE'], null]]
  });

  let shadeLayer = new MapLibreShaderLayer(map, 'maplewood-shade', ['maplewood'], { fragmentSource: frag,animate: animation });
  window.addEventListener('resize', () => {
    updateResolution();
  });
  function updateResolution() {
    const gl = shadeLayer.context;
    const prog = shadeLayer.program;
    const u_resolutionLocation = gl.getUniformLocation(prog, 'u_resolution');
    gl.uniform2fv(u_resolutionLocation, [map.getContainer().offsetWidth, map.getContainer().offsetHeight]);

  }
  let frameNum = 0;
  function animation(_slayer) {
    frameNum++;
    frameNum++;
    const gl = _slayer.context;
    const prog = _slayer.program;

    gl.useProgram(prog);
    let u_frame= gl.getUniformLocation(prog, 'u_frame');
    gl.uniform1f(u_frame, frameNum);

    map.triggerRepaint();
    requestAnimationFrame(() => { animation(_slayer) });
  }


  map.on('move',()=> shadeLayer.updateMapBBox());
  map.addLayer(shadeLayer);
});


