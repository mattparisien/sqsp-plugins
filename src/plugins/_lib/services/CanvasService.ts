import PluginService from "./PluginService";

interface ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  initializeCanvas(element: HTMLCanvasElement): void;
}

class CanvasService extends PluginService implements ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;

  constructor(container: HTMLCanvasElement) {
    super();
    this.canvas = container;
    this.context = this.canvas.getContext("2d");

  }

  init(): void {}

  initializeCanvas(element: HTMLCanvasElement): void {
    this.canvas = element;
  }
}

export default CanvasService;
