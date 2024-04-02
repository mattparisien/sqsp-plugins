import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
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
  implements IMouseFollower
{
  private _canvasService: CanvasService;
  private _tickService: AnimationFrameService;
  private _mouseEventsService: MouseEventsService;

  posX = 0;
  posY = 0;
  isDisabled = false;

  options: PluginOptions<IMouseFollowerOptions> = {
    color: "red",
    radius: 10,
    speed: 0.1,
  };

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, "Mouse Follower");

    this.options = this.validateOptions(options);
    this.options._radius = this.options.radius;

    this._canvasService = new CanvasService(
      this.container as HTMLCanvasElement
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
      {
        event: EMouseEvent.Out,
        handler: this.onMouseOut.bind(this),
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

  onMouseMove(event: MouseEvent): void {
    if (this.options.radius === 0 && !this.isDisabled) {
      this.scaleIn();
      this.isDisabled = true;
    }
  }

  onMouseEnter(event: MouseEvent): void {}

  onMouseOut(event: MouseEvent): void {
    this.scaleOut();
    this.isDisabled = false;
  }

  addListeners() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    const links = DomUtils.querySelectorAll(["button", "a"]);

    links.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        this.isDisabled = true;
        this.scaleOut();
      });
      link.addEventListener("mouseleave", (e) => {
        this.isDisabled = false;
        this.scaleIn();
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
