import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService
} from "../_lib/services";
import { PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import PluginBase, { PluginAllowedOptions } from "../_PluginBase/model";

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
  implements IMouseFollower
{
  private _canvasService: CanvasService;
  private _tickService: AnimationFrameService;
  private _mouseEventsService: MouseEventsService;

  posX = 0;
  posY = 0;
  isDisabled = false;

  allowedOptions: PluginAllowedOptions<IMouseFollowerOptions> = [
    "color",
    "radius",
    "speed",
  ];

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, options);

    this._mouseEventsService = new MouseEventsService(this.container, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove,
      },
      {
        event: EMouseEvent.Enter,
        handler: this.onMouseEnter,
      },
      {
        event: EMouseEvent.Out,
        handler: this.onMouseOut,
      },
    ]);
  }

  protected validateOptions(
    options: PluginOptions<IMouseFollowerOptions>
  ): PluginOptions<IMouseFollowerOptions> {
    const validatedOptions = {};

    Object.entries(options).forEach((entry) => {
      this.allowedOptions.forEach((allowedOption) => {
        if (entry[0] === allowedOption) {
          validatedOptions[allowedOption] = entry[1];
        }
      });
    });

    return validatedOptions as PluginOptions<IMouseFollowerOptions>;
  }

  resizeCanvas() {
    this._canvasService.canvas.width = window.innerWidth;
    this._canvasService.canvas.height = window.innerHeight;
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  draw() {
    this._canvasService.context.clearRect(
      0,
      0,
      this._canvasService.context.canvas.width,
      this._canvasService.context.canvas.height
    );
    this._canvasService.context.beginPath();
    this._canvasService.context.arc(
      this.posX,
      this.posY,
      this.options.radius,
      0,
      2 * Math.PI
    );
    this._canvasService.context.lineWidth = 5;
    this._canvasService.context.fillStyle = this.options.color;
    this._canvasService.context.fill();
  }

  scaleIn() {
    gsap.to(this.options, {
      radius: this.options._radius,
      ease: "Power3.Out",
      duration: 0.1,
    });
  }

  scaleOut() {
    this.options._radius = this.options.radius;
    gsap.to(this.options, { radius: 0, ease: "Power3.Out", duration: 0.1 });
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

  onMouseMove(event: MouseEvent): void {
    if (this.options.radius === 0 && !this.isDisabled) this.scaleIn();
  }

  onMouseEnter(event: MouseEvent): void {}

  onMouseOut(event: MouseEvent): void {
    this.scaleOut();
  }

  addListeners() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    const links = DomUtils.querySelectorAll(["button", "a"]);

    links.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        console.log("enter!", e.currentTarget);
        this.isDisabled = true;
        this.scaleOut.bind(this);
      });
      link.addEventListener("mouseleave", (e) => {
        this.isDisabled = false;
        this.scaleIn.bind(this);
      });
    });
  }

  init() {
    this._canvasService.init();
    this._tickService.init();
    this._mouseEventsService.init();

    this.resizeCanvas();
    this.addListeners();
    this.draw();
  }
}

export default MouseFollower;
