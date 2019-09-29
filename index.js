/* eslint-disable newline-after-var */
import canvasSketch from "canvas-sketch";
import { lerp } from "canvas-sketch-util/math";

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

  const points = createGrid(45).filter(() => Math.random() >= 0.5);

  /**
   * margin together with lerp (linear interpolation)
   * helps us to give some 'breathin space' to the artwork in
   * the canvas
   */
  const margin = 400;
  return ({ context, width, height }) => {
    points.forEach(([i, j]) => {
      const x = lerp(margin, width - margin, i);
      const y = lerp(margin, height - margin, j);

      context.beginPath();
      context.arc(x, y, 100, 0, Math.PI * 2, false);
      context.strokeStyle = "gray";
      context.lineWidth = 1;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
