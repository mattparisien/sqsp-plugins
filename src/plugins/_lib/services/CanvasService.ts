import PluginService from "./PluginService";

interface ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  initializeCanvas(element: HTMLCanvasElement): void;
}

class CanvasService extends PluginService implements ICanvasService {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null = null;

  constructor() {
    super();
    this.canvas = document.createElement("canvas");
  }

  init(): void {}

  initializeCanvas(element: HTMLCanvasElement): void {
    this.canvas = element;
    this.context = this.canvas.getContext("2d");
  }
}

export default CanvasService;
