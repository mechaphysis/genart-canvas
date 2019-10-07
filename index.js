/* eslint-disable no-console */
/* eslint-disable newline-after-var */
import canvasSketch from "canvas-sketch";
import { lerp } from "canvas-sketch-util/math";
import random from "canvas-sketch-util/random";
import palettes from "nice-color-palettes";

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 5);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);

  const createGrid = count => {
    const points = [];
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const i = x / (count - 1);
        const j = y / (count - 1);
        /**
         * Noise 2D gives us an even more organic feeling to the randomness.
         * Don't forget to wrap it in absolute (Math.abs) to avoid passing
         * negative numbers as radius, as this will cause an error
         */
        const radius = Math.abs(random.noise2D(i, j));
        points.push({
          color: random.pick(palette),
          position: [i, j],
          radius, // gaussian is a more 'organic' randomness
          rotation: random.noise2D(i, j)
        });
      }
    }
    return points;
  };

  // Set a deterministic seed for random, it can be a string or a number:
  const points = createGrid(50).filter(() => random.value() > 0.5);

  /**
   * margin together with lerp (linear interpolation)
   * helps us to give some 'breathin space' to the artwork in
   * the canvas
   */
  const margin = 200;
  return ({ context, width, height }) => {
    // Change background to a nice dark-bluish gray
    //context.fillStyle = "hsl(227, 21%, 13%)";
    context.fillRect(0, 0, width, height);

    /**
     * Loop over points array and deestructure each element
     */
    points.forEach(pointData => {
      const {
        position: [i, j],
        radius,
        color,
        rotation
      } = pointData;
      const x = lerp(margin, width - margin, i);
      const y = lerp(margin, height - margin, j);

      /**
       *
        context.beginPath();
        context.arc(x, y, radius * width * 0.015, 0, Math.PI * 2, false);
        context.fillStyle = color;
        context.fill();
        context.stroke();
       */
      context.save();
      context.fillStyle = color;
      context.font = `${radius * 150}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText("=", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
