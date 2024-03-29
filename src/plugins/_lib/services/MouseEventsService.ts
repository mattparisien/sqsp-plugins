import { has } from "lodash";
import PluginService from "./PluginService";

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

type TMouseEventHandler = (event: MouseEvent) => void;

interface IMouseEventOption {
  event: EMouseEvent;
  handler?: TMouseEventHandler;
}

// Combine the interfaces using a union type to allow only one of the keys

class MouseEventsService extends PluginService {
  clientX = 0;
  clientY = 0;


  isHovering = false;
  isMouseMoving = false;

  
  private _element: Window | HTMLElement;
  private _options?: IMouseEventOption[];
  private _mouseMoveTimeOut?: number; // Timeout ID for debouncing
  private _debounceDelay = 300; // Delay in milliseconds
  

  constructor(element: Window | HTMLElement, options?: IMouseEventOption[]) {
    super();
    this._element = element;
    this._options = options;

    // Bind event handlers to ensure 'this' context is preserved when called as event listeners
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  private removeEventListeners(): void {
    Object.values(EMouseEvent).forEach((event) => {
      this._element.removeEventListener(event.toLowerCase(), this[`on${event}`]);
    });
  }

  private addEventListeners(options: IMouseEventOption[]): void {
    options.forEach(({ event, handler }) => {
      this._element.addEventListener(event.toLowerCase(), (e) =>
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
    this.isMouseMoving = true;
    clearTimeout(this._mouseMoveTimeOut); // Clear existing timer
    this._mouseMoveTimeOut = window.setTimeout(() => {
      this.isMouseMoving = false; // Set to false after a period of inactivity
    }, this._debounceDelay);
    callback?.(event);
  }

  onMouseOut(event: MouseEvent, callback?: TMouseEventHandler): void {
    if (this.isHovering) this.isHovering = false;
    callback?.(event);
  }

  init(): void {
    this.addEventListeners(this._options);
  }

  // Ensure to call removeEventListeners when the service is no longer needed
  destroy(): void {
    this.removeEventListeners();
  }
}

export default MouseEventsService;
