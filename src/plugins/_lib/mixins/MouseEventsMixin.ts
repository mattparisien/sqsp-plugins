import { Constructor } from "../ts/types";
import { has } from "lodash";

// Attention: Values must be in PascalCase to preserve functionality
export enum EMouseEvent {
  Enter = "MouseEnter",
  Leave = "MouseLeave",
  Out = "MouseOut",
  Over = "MouseOver",
  Move = "MouseMove",
}

interface IMouseEvents {
  element: Window | HTMLElement;
  clientX: number;
  clientY: number;
  isHovering: boolean;
  getAvailableEvents(): EMouseEvent[];
  addEventListeners(): void;
  removeEventListeners(): void;
}

// Base options that always apply
interface IBaseMouseEventsOptions {
  exclude?: EMouseEvent[];
}

// Options that apply only when T extends Window
interface IWindowMouseEventsOptions {
  include?: Exclude<EMouseEvent, EMouseEvent.Enter | EMouseEvent.Leave>[];
  useWindow: true;
}

// The completed MouseEventsOptions type
type TMouseEventsOptions<T> = IBaseMouseEventsOptions &
  (T extends Window ? IWindowMouseEventsOptions : { include?: EMouseEvent[] });

function MouseEventsMixin<T extends Constructor, U>(
  Base: T,
  options?: TMouseEventsOptions<U>
) {
  return class extends Base implements IMouseEvents {
    clientX = 0;
    clientY = 0;
    isHovering = false;
    element = null;

    constructor(...args: any[]) {
      const element = args[0];
      const config  = args[1];
      super(element as HTMLElement, config);

      this.element = (options as IWindowMouseEventsOptions)?.useWindow ? window : element;

      // Bind event handlers to ensure 'this' context is preserved when called as event listeners
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseOut = this.onMouseOut.bind(this);

      if ("window" in this.element || this.element instanceof HTMLElement) {
        this.addEventListeners();
      } else {
        throw new TypeError(
          "MouseEventsMixin: Invalid element type. Must be either of type Window or HTMLElement."
        );
      }
    }

    addEventListeners(): void {
      let actions: EMouseEvent[] = [];

      // If no options were passed, include all listeners
      if (
        !options ||
        (!has(options, "include") && !has(options, "exclude")) ||
        (has(options, "exclude") && options["exclude"]?.length)
      ) {
        actions.push(...this.getAvailableEvents());

        // If the include option is passed, only include the options in the array
      } else if (has(options, "include")) {
        const includedEvents = Object.values(options["include"]);

        actions.push(...includedEvents);
        console.log(actions);
      }

      // If the exclude option is passed, only exclude the options in the array
      if (has(options, "exclude")) {
        actions = actions.filter(
          (action: EMouseEvent) =>
            !Object.values(options["exclude"].includes(action))
        );
      }

      this.renderEventListeners(actions);
    }

    removeEventListeners(): void {
      this.element.removeEventListener("mouseenter", this.onMouseEnter);
      this.element.removeEventListener("mouseleave", this.onMouseLeave);
      this.element.removeEventListener("mousemove", this.onMouseMove);
    }

    renderEventListeners(events: EMouseEvent[]) {
      events.forEach((event) => {
        this.element.addEventListener(event.toLowerCase(), this[`on${event}`]);
      });
    }

    getAvailableEvents() {
      return Object.values(EMouseEvent);
    }

    onMouseEnter(event: MouseEvent): void {
      if (!this.isHovering) this.isHovering = true;
    }

    onMouseLeave(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {
      if (!this.isHovering) this.isHovering = true;
      this.clientX = event.clientX;
      this.clientY = event.clientY;
    }

    onMouseOut(event: MouseEvent): void {
      if (this.isHovering) this.isHovering = false;
    }
    // Ensure to call removeEventListeners when the plugin or feature is destroyed
    destroy(): void {
      this.removeEventListeners();
    }
  };
}

export default MouseEventsMixin;
