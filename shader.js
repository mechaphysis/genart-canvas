const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

// Setup our sketch
const settings = {
  context: "webgl",
  animate: true
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspectRatio;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d')

  void main () {

    vec2 center = vUv - 0.5;
    center *= aspectRatio;
    float n = noise(vec3(center * 1.0, time));
    gl_FragColor = vec4(vec3(n), 1.0); 
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    clearColor: false,
    // Pass along WebGL context
    gl,
    // Specify fragment and/or vertex shader strings
    frag,
    // Specify additional uniforms to pass down to the shaders
    uniforms: {
      // Expose props from canvas-sketch
      time: ({ time }) => time,
      aspectRatio: ({ width, height }) => width / height
    }
  });
};

canvasSketch(sketch, settings);
