import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import ArrayUtils from "../_lib/utils/ArrayUtils";
import ColorUtils from "../_lib/utils/ColorUtils";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IMouseFollowerOptions {
  color: string;
  radius: number;
  speed: number;
  palette: string[];
}

type TRGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

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
  private _partyTimerId: any = null;
  private _partyTimerMs: number = 500;

  private _color: { r: number; g: number; b: number } | null = null;

  posX = 0;
  posY = 0;
  isDisabled = false;

  options: PluginOptions<IMouseFollowerOptions> = {
    color: "red",
    radius: 20,
    speed: 0.1,
    palette: ArrayUtils.shuffle([
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
    ]),
  };

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, "Mouse Follower");

    this.options = this.validateOptions(options);
    this.options._radius = this.options.radius;

    this._canvasService = new CanvasService(
      this.container as HTMLCanvasElement,
      "2d",
      {
        blendMode: "exclusion",
      }
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

  protected validateOptions(
    options: PluginOptions<IMouseFollowerOptions>
  ): PluginOptions<IMouseFollowerOptions> {
    return this.mergeOptions(options, this.options);
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
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.options.radius, 0, 2 * Math.PI);
    ctx.lineWidth = 5;
    ctx.fillStyle = `rgb(${this._color.r}, ${this._color.g}, ${this._color.b})`;
    ctx.fill();
  }

  scaleIn() {
    if (this.options.radius !== this.options._radius) {
      // Only scale in if not already at original radius
      gsap.to(this.options, {
        radius: this.options._radius,
        ease: "Power3.Out",
        duration: 0.1,
      });
    }
  }

  scaleOut() {
    if (this.options.radius !== 0) {
      // Only scale out if not already at radius 0
      this.options._radius = this.options.radius; // Update _radius to current radius before scaling out
      gsap.to(this.options, { radius: 0, ease: "Power3.Out", duration: 0.1 });
    }
  }

  onTick(): void {
    this.posX = this.lerp(
      this.posX,
      this._mouseEventsService.clientX,
      this.options.speed
    );
    this.posY = this.lerp(
      this.posY,
      this._mouseEventsService.clientY,
      this.options.speed
    );
    this.draw();
  }

  updateColor() {
    // Ensure there's a palette to choose from
    if (!this.options.palette || !this.options.palette.length) return;

    // Select a random color from the palette
    const newColorHex =
      this.options.palette[
        Math.floor(Math.random() * this.options.palette.length)
      ];
    const newColorRgb = ColorUtils.hexToRgb(newColorHex);

    // Use GSAP to transition the current color to the new color
    gsap.to(this._color, {
      r: newColorRgb.r,
      g: newColorRgb.g,
      b: newColorRgb.b,
      duration: 0.5, // Duration of the color transition
      onUpdate: () => {
        // Update the canvas or element with the new color
        // this.options.color = `rgb(${this._color.r}, ${this._color.g}, ${this._color.b})`;
        this.draw(); // Redraw or update the element with the new color
      },
    });
  }

  initPartyTimer() {
    this._partyTimerId = setInterval(() => {
      this.updateColor();
    }, this._partyTimerMs);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this._partyTimerId) {
      this.initPartyTimer();
    }

    if (this.options.radius === 0 && !this.isDisabled) {
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
    this._color = ColorUtils.hexToRgb(this.options.color);
    this._canvasService.init();
    this._tickService.init();
    this._mouseEventsService.init();

    this.resizeCanvas();
    this.addListeners();
    this.draw();
  }
}

export default MouseFollower;
