import gsap from "gsap";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import WebGLService from "../_lib/services/WebGLService";
import { PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IMouseFollowerOptions {
  color: string;
  radius: number;
  style: "outline" | "fill";
  speed: number;
  skewing: number;
  skewingDelta: number;
  skewingDeltaMax: number;
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

  // #region Private members

  private _webGlService : WebGLService | null = null;
  private _tickService: AnimationFrameService | null = null;
  private _mouseEventsService: MouseEventsService | null = null;
  
  private _ctx: RenderingContext| null = null;
  private _cnv: HTMLCanvasElement | null = null;

  // #endregion

  // #region Shader programs

  // Vertex shader program
  private readonly _vsSource : string = `
      attribute vec4 aVertexPosition;
      void main(void) {
          gl_Position = aVertexPosition;
      }
  `;

  // Fragment shader program
  private readonly _fsSource : string = `
      precision mediump float;
      uniform vec2 uMousePosition;
      uniform vec2 uResolution;
      void main(void) {
          float radius = 0.05; // Radius of the circle
          vec2 coords = gl_FragCoord.xy / uResolution.xy;
          float dist = distance(coords, uMousePosition);
          if (dist < radius) {
              gl_FragColor = vec4(1, 0, 0, 1); // Red circle
          } else {
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); // Black background
          }
      }
  `;

  // #endregion

  posX = 0;
  posY = 0;
  isDisabled = false;

  options: PluginOptions<IMouseFollowerOptions> = {
    color: "black",
    radius: 10,
    style: "fill",
    speed: 0.01,
    skewing: 0.0,
    skewingDelta: 0.001,
    skewingDeltaMax: 0.15,
  };

  constructor(container: any, options: PluginOptions<IMouseFollowerOptions>) {
    super(container, "Mouse Follower");

    this.options = this.validateOptions(options);
    this.options._radius = this.options.radius;

    this._webGlService       = new WebGLService(container, { vertex: this._vsSource, fragment: this._fsSource});
    this._tickService        = new AnimationFrameService(this.onTick.bind(this));
    this._mouseEventsService = new MouseEventsService(window, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
      {
        event: EMouseEvent.Out,
        handler: this.onMouseOut.bind(this),
      },
    ]);
    
    this._ctx = this._webGlService.getContext();
    this._cnv = this._webGlService.getCanvas();

  }

  protected validateOptions(
    options: PluginOptions<IMouseFollowerOptions>
  ): PluginOptions<IMouseFollowerOptions> {
    if (
      options.style &&
      options.style !== "fill" &&
      options.style !== "outline"
    ) {
      options.style = null;
      console.error(`Option value '${options.style}' is not a valid for style`);
    }

    return this.mergeOptions(options, this.options);
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  draw() {
    // this._canvasService.context.clearRect(
    //   0,
    //   0,
    //   this._canvasService.context.canvas.width,
    //   this._canvasService.context.canvas.height
    // );
    // this._canvasService.context.beginPath();
    // this._canvasService.context.arc(
    //   this.posX,
    //   this.posY,
    //   this.options.radius,
    //   0,
    //   2 * Math.PI
    // );

    // switch (this.options.style) {
    //   case "fill":
    //     this.fill();
    //     break;
    //   case "outline":
    //     this.stroke();
    //     break;
    // }
  }

  stroke() {
    // this._ctx.lineWidth = 1;
    // this._ctx.strokeStyle = this.options.color;
    // this._ctx.stroke();
  }

  fill() {
    // this._ctx.fillStyle = this.options.color;
    // this._ctx.fill();
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

  onMouseOut(event: MouseEvent): void {
    this.scaleOut();
    this.isDisabled = false;
  }

  addListeners() {
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
    this._tickService.init();
    this._mouseEventsService.init();
    this._webGlService.init();

    this.addListeners();
    this.draw();
  }
}

export default MouseFollower;
