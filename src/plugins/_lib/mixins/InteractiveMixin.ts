import { Constructor } from "../ts/types";

interface IInteractive {
  clientX: number;
  clientY: number;
  addEventListeners(): void;
  removeEventListeners(): void;
}

function InteractiveMixin<T extends Constructor>(Base: T) {
  return class extends Base implements IInteractive {
    clientX: number;
    clientY: number;
    element: HTMLElement;

    constructor(...args: any[]) {
      const element = args[0];
      const config  = args[1];
      super(element as HTMLElement, config);
      this.element = element;

      // Bind event handlers to ensure 'this' context is preserved when called as event listeners
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);

      this.addEventListeners();
    }

    addEventListeners(): void {
      this.element.addEventListener("mouseenter", this.onMouseEnter);
      this.element.addEventListener("mouseleave", this.onMouseLeave);
      this.element.addEventListener("mousemove", this.onMouseMove);
    }

    removeEventListeners(): void {
      this.element.removeEventListener("mouseenter", this.onMouseEnter);
      this.element.removeEventListener("mouseleave", this.onMouseLeave);
      this.element.removeEventListener("mousemove", this.onMouseMove);
    }

    onMouseEnter(event: MouseEvent): void {}

    onMouseLeave(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {
      this.clientX = event.clientX;
      this.clientY = event.clientY;
    }

    // Ensure to call removeEventListeners when the plugin or feature is destroyed
    destroy(): void {
      this.removeEventListeners();
    }
  };
}

export default InteractiveMixin;
