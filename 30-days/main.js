import maplibregl from 'maplibre-gl';
import maplewood from './assets/pest_4326.json';
import MapLibreShaderLayer from './ShaderLayer';
import frag from './assets/frag.glsl';

const map = new maplibregl.Map({
  container: 'map', // container id
  style: 'assets/osm_liberty.json',
  hash: true,
  antialias: true,
  center: [-83.94, 45.28], // starting position
  zoom: 5// starting zoom
});



map.on('load', () => {
  // Add a source and layer displaying a point which will be animated in a circle.



  let shadeLayer = new MapLibreShaderLayer(map, 'water-glitch', ['water'], { fragmentSource: frag, animate: animation });
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
    let u_frame = gl.getUniformLocation(prog, 'u_frame');
    gl.uniform1f(u_frame, frameNum);

    map.triggerRepaint();
    requestAnimationFrame(() => { animation(_slayer) });
  }


  map.on('move', () => shadeLayer.updateMapBBox());
  map.addLayer(shadeLayer);
});


