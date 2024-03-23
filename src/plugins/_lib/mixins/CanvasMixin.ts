import { Constructor } from "../ts/types";

interface ICanvas {}

function CanvasMixin<T extends Constructor>(Base: T) {
  return class extends Base implements ICanvas {
    canvas: HTMLElement;

    constructor(...args: any[]) {
      const element = args[0];
      super(element as HTMLElement);
      this.canvas = element;
    }
  };
}

export default CanvasMixin;
