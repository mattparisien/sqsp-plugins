interface ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  initializeCanvas(element: HTMLCanvasElement): void;
}

class CanvasService implements ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;

  constructor() {
    // Initially, the canvas and context are not set.
    this.canvas = document.createElement("canvas"); // Placeholder canvas
  }

  initializeCanvas(element: HTMLCanvasElement): void {
    this.canvas = element;
    this.context = this.canvas.getContext("2d");
  }
}

export default CanvasService;
