import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import ArrayUtils from "../_lib/utils/ArrayUtils";
import PluginBase from "../_PluginBase/model";

interface IMouseFollowerOptions {
  mode: "default" | "party";
  color: string;
  radius: number;
  speed: number;
  palette: string[];
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
  implements IMouseFollower
{
  private _canvasService: CanvasService;
  private _tickService: AnimationFrameService;
  private _mouseEventsService: MouseEventsService;

  private _color: string = "red";
  private _radius: number = 10;
  private _speed: number = 0.2;
  private _palette: string[] = ArrayUtils.shuffle([
    "#61833C",
    "#DC8D82",
    "#B32C2A",
    "#DC969E",
    "#CFCDC4",
    "#507941",
    "#CC7A3B",
    "#7092AD",
    "#AF6530",
    "#F2AC0A",
    "#F3D5B6",
    "#B0A336",
    "#AD9AB0",
  ]);

  private _colorProxy: string = this._color;
  private _radiusProxy: number = this._radius;

  posX = 0;
  posY = 0;
  isDisabled = false;

  allowedOptions: (keyof IMouseFollowerOptions)[] = [
    "color",
    "mode",
    "palette",
    "radius",
    "speed",
  ];

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, "Mouse Follower");

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

  protected validateOptions(options: PluginOptions<IMouseFollowerOptions>) {
    console.log('the options are', options);
    this.setOptions(options);
  }

  resizeCanvas() {
    this._canvasService.canvas.width = window.innerWidth;
    this._canvasService.canvas.height = window.innerHeight;
  }

  lerp(start, end, t) {
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

  onMouseEnter(event: MouseEvent): void {}

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

    this.resizeCanvas();
    this.addListeners();
    this.draw();
  }
}

export default MouseFollower;
