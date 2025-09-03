import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

interface IMouseFollowerOptions {
  color: string;
  radius: number;
  speed: number;
}

interface IMouseFollower {
  posX: number;
  posY: number;
  isDisabled: boolean;
  init(): void;
  scaleIn(): void;
  scaleOut(): void;
  lerp(start: number, end: number, amount: number): number;
}

class MouseFollower
  extends PluginBase<IMouseFollowerOptions>
  implements IMouseFollower {
  private _canvasService: CanvasService;
  private _tickService: AnimationFrameService;
  private _mouseEventsService: MouseEventsService;

  private _color: string = "red";
  private _radius: number = 10;
  private _speed: number = 0.2;

  private _colorProxy: string = this._color;
  private _radiusProxy: number = this._radius;

  posX = 0;
  posY = 0;
  isDisabled = false;

  options: PluginOptions<IMouseFollowerOptions> = {
    color: this._color,
    radius: this._radius,
    speed: this._speed,
  }

  allowedOptions: (keyof IMouseFollowerOptions)[] = [
    "color",
    "radius",
    "speed",
  ];

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, "Mouse Follower");

    this.options = this.validateOptions(options);
    this._canvasService = new CanvasService(
      this.container as HTMLCanvasElement,
      "2d"
    );
    this._tickService = new AnimationFrameService(this.onTick.bind(this));
    this._mouseEventsService = new MouseEventsService(window, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
      {
        event: EMouseEvent.Enter,
        handler: this.onMouseEnter.bind(this),
      },
    ]);
  }

  protected validateOptions(options: PluginOptions<IMouseFollowerOptions>): PluginOptions<IMouseFollowerOptions> {
    this.setOptions(options);

    // Parse and apply options
    if (options.radius !== undefined) {
      this._radius = typeof options.radius === 'string' ? parseFloat(options.radius) : options.radius;
    }
    if (options.speed !== undefined) {
      this._speed = typeof options.speed === 'string' ? parseFloat(options.speed) : options.speed;
    }
    if (options.color !== undefined) {
      this._color = options.color;
    }

    return this.options;
  }

  resizeCanvas() {
    this._canvasService.canvas.width = window.innerWidth;
    this._canvasService.canvas.height = window.innerHeight;

    // Make canvas background transparent
    const ctx = this._canvasService.context as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  lerp(start: number, end: number, t: number): number {
    return start * (1 - t) + end * t;
  }

  draw() {
    const ctx = this._canvasService.context as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this._radius, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.fillStyle = this._color;
    ctx.fill();

  }

  scaleIn() {
    if (this._radius !== this._radiusProxy) {
      // Only scale in if not already at original radius
      gsap.to(this, {
        _radius: this._radiusProxy,
        ease: "Power3.Out",
        duration: 0.1,
      });
    }
  }

  scaleOut() {
    if (this._radius !== 0) {
      gsap.to(this, { _radius: 0, ease: "Power3.Out", duration: 0.1 });
    }
  }

  onTick(): void {

    this.posX = this.lerp(
      this.posX,
      this._mouseEventsService.clientX,
      this._speed
    );
    this.posY = this.lerp(
      this.posY,
      this._mouseEventsService.clientY,
      this._speed
    );
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    if (this._radius === 0 && !this.isDisabled) {
      this.scaleIn();
      this.isDisabled = true;
    }
  }

  onMouseEnter(event: MouseEvent): void { }

  onMouseOut(event: MouseEvent): void {
    // this.scaleOut();
    this.isDisabled = false;
  }

  addListeners() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }

  init() {
    this._radiusProxy = this._radius;
    this._colorProxy = this._color;

    this._canvasService.init();
    this._tickService.init();
    this._mouseEventsService.init();

    // Set canvas to be transparent
    (this._canvasService.canvas as HTMLCanvasElement).style.backgroundColor = 'transparent';

    this.resizeCanvas();
    this.addListeners();
    this.draw();
  }
}

export default MouseFollower;
