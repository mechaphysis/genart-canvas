// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require("eases");
const bezierEasing = require("bezier-easing");
const glslify = require("glslify");

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // Turn on MSAA
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    context
  });

  // WebGL background color
  renderer.setClearColor("hsl(0,0%,95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  /* 
  For efficiency we only create the Box Geometry once, 
  and reuse it throrough the loop
  */
  const box = new THREE.BoxGeometry(1, 1, 1);

  /**
   * Defining Shader properties for ShaderMaterial:
   */

  const fragmentShader = `
    varying vec2 vUv;
    uniform vec3 color;
    void main(){
      gl_FragColor = vec4(vUv.x *color, 1.0);
    }
  `;

  const vertexShader = glslify(`
    varying vec2 vUv;
    uniform float time;

    #pragma glslify: noise = require('glsl-noise/simplex/4d');
    
    void main() {
      vUv = uv; 
      vec3 pos = position.xyz;
      pos *= noise(vec4(position.xyz*time,time)) * 10.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `);
  const palette = random.pick(palettes);
  const cubes = [];
  for (let index = 0; index < 60; index++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: {
          color: { value: new THREE.Color(random.pick(palette)) },
          time: { value: 0 }
        }
      })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(0.3);
    scene.add(mesh);
    cubes.push(mesh);
  }

  // ambient light makes shadows less "harsh"
  scene.add(new THREE.AmbientLight("hsl(0,0%,20%)")); //soft gray

  const light = new THREE.DirectionalLight("white", 1);
  light.position.set(2, 2, 4);
  scene.add(light);

  /**
   * The values provided for the constructor can be
   * explored and generated through cubic-bezier.com
   */
  const easeFn = bezierEasing(0.17, 0.67, 0.88, 0);
  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead, time }) {
      //exponential in out ease is a sharp ease-in-out
      scene.rotation.z = easeFn(Math.sin(playhead * Math.PI));
      cubes.forEach(cube => {
        cube.material.uniforms.time.value = Math.cos(playhead * Math.PI * 2);
      });
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
