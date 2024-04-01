import PluginService from "./PluginService";

type TCanvasContext = "2d" | "webgl";

interface ICanvasService {
  canvas: HTMLCanvasElement;
  context: RenderingContext | null;
  initializeCanvas(element: HTMLCanvasElement): void;
}

class CanvasService extends PluginService implements ICanvasService {
  public canvas: HTMLCanvasElement;
  public context: RenderingContext | null = null;

  constructor(container: HTMLCanvasElement, context?: TCanvasContext) {
    super();
    this.canvas = container;
    this.context = this.canvas.getContext(context);
    this.addListeners();
  }

  init(): void {
    this.sizeCanvas();
  }

  initializeCanvas(element: HTMLCanvasElement): void {
    this.canvas = element;
  }

  sizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onResize() {
    this.sizeCanvas();
  }

  addListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}

export default CanvasService;
