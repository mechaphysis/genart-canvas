/* eslint-disable newline-after-var */
import canvasSketch from "canvas-sketch";
import { lerp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const createGrid = count => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const i = x / (count - 1);
        const j = y / (count - 1);
        points.push([i, j]);
      }
    }
    return points;
  };

  // Set a deterministic seed for random, it can be a string or a number:
  random.setSeed("asdfghsertyud");
  const points = createGrid(40).filter(() => random.value() > 0.5);

  /**
   * margin together with lerp (linear interpolation)
   * helps us to give some 'breathin space' to the artwork in
   * the canvas
   */
  const margin = 200;
  return ({ context, width, height }) => {
    // Change background to a nice dark-bluish gray
    context.fillStyle = "hsl(227, 21%, 13%)";
    context.fillRect(0, 0, width, height);

    /**
     * Loop over points array and deestructure each element, of the shape
     * [i,j]
     */
    points.forEach(([i, j]) => {
      const x = lerp(margin, width - margin, i);
      const y = lerp(margin, height - margin, j);

      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2, false);
      context.strokeStyle = "gray";
      context.lineWidth = 10;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
