import { has } from "lodash";

export enum EMouseEvent {
  Enter = "MouseEnter",
  Leave = "MouseLeave",
  Out = "MouseOut",
  Over = "MouseOver",
  Move = "MouseMove",
}

interface IMouseEventOption {
  event: EMouseEvent;
  handler?: (event: MouseEvent) => void;
}

// // Define interfaces for the exclusive options
// interface IExcludeMouseEventsOptions {
//   exclude: EMouseEvent[];
//   include?: never;
// }

// interface IIncludeMouseEventsOptions {
//   exclude?: never;
//   include: EMouseEvent[];
// }

type TMouseEventHandler = (event: MouseEvent) => void;

interface IMouseEventOption {
  event: EMouseEvent;
  handler?: TMouseEventHandler;
}

// Combine the interfaces using a union type to allow only one of the keys

class MouseEventsService {
  clientX = 0;
  clientY = 0;
  isHovering = false;
  private element: Window | HTMLElement;
  private options?: IMouseEventOption[];

  constructor(element: Window | HTMLElement, options?: IMouseEventOption[]) {
    this.element = element;
    this.options = options;

    // Bind event handlers to ensure 'this' context is preserved when called as event listeners
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove  = this.onMouseMove.bind(this);
    this.onMouseOut   = this.onMouseOut.bind(this);

    this.addEventListeners(options);
  }

  removeEventListeners(): void {
    Object.values(EMouseEvent).forEach((event) => {
      this.element.removeEventListener(event.toLowerCase(), this[`on${event}`]);
    });
  }

  private addEventListeners(options: IMouseEventOption[]): void {
    options.forEach(({ event, handler }) => {
      this.element.addEventListener(event.toLowerCase(), (e) =>
        this[`on${event}`]?.(e, handler)
      );
    });
  }

  getAvailableEvents(): EMouseEvent[] {
    return Object.values(EMouseEvent);
  }

  onMouseEnter(event: MouseEvent, callback?: TMouseEventHandler): void {
    if (!this.isHovering) this.isHovering = true;
    callback?.(event);
  }

  onMouseLeave(event: MouseEvent, callback?: TMouseEventHandler): void {
    if (this.isHovering) this.isHovering = false;
    callback?.(event);
  }

  onMouseMove(event: MouseEvent, callback?: TMouseEventHandler): void {
    if (!this.isHovering) this.isHovering = true;
    this.clientX = event.clientX;
    this.clientY = event.clientY;
    callback?.(event);
  }

  onMouseOut(event: MouseEvent, callback?: TMouseEventHandler): void {
    if (this.isHovering) this.isHovering = false;
    callback?.(event);
  }

  // Ensure to call removeEventListeners when the service is no longer needed
  destroy(): void {
    this.removeEventListeners();
  }
}

export default MouseEventsService;
