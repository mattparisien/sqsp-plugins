import { Constructor } from "../ts/types";

interface ICanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

function CanvasMixin<T extends new (...args: any[]) => any>(Base: T) {
  return class extends Base implements ICanvas {
    canvas  = null;
    context = null;

    constructor(...args: any[]) {
      const element = args[0];
      super(element as HTMLElement);
      
      this.canvas  = element;
      this.context = this.canvas.getContext("2d");
    }
  };
}

export default CanvasMixin;
