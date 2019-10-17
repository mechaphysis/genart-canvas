const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

// Setup our sketch
const settings = {
  context: "webgl",
  animate: true,
  dimensions: [512, 512]
};

// Your glsl code
const frag = glsl(/* glsl */ `
  precision highp float;

  uniform float time;
  uniform float aspectRatio;
  varying vec2 vUv;

  #pragma glslify: noise = require('glsl-noise/simplex/3d')
  #pragma glslify: hsl2rgb = require('glsl-hsl2rgb')
  void main () {

    vec2 center = vUv - 0.5;
    center *= aspectRatio;
    float n = noise(vec3(center, time * 0.1));
    float distance = length(center);
    float alpha = smoothstep(0.25075, 0.25, distance);

    vec3 color = hsl2rgb(
      n*0.3  + 0.3,
      0.3,
      0.25
    );
    gl_FragColor = vec4(color, alpha); 
  }
`);

// Your sketch, which simply returns the shader
const sketch = ({ gl }) => {
  // Create the shader and return it
  return createShader({
    //clearColor: "gray",
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
