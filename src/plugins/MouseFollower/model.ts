import gsap from "gsap";
import selectorMap from "../_lib/config/selectorMapping";
import {
  AnimationFrameMixin,
  CanvasMixin,
  MouseEventsMixin,
} from "../_lib/mixins";
import { merge } from "lodash";
import { EMouseEvent } from "../_lib/mixins/MouseEventsMixin";
import { PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IMouseFollowerOptions extends PluginOptions {
  color: string;
  radius: number;
  speed: number;
}

interface IMouseFollower {
  posX: number;
  posY: number;
  isDisabled: boolean;
  options: IMouseFollowerOptions;
  optionsProxy: IMouseFollowerOptions;
  init(): void;
  scaleIn(): void;
  scaleOut(): void;
  lerp(start: number, end: number, amount: number): number;
}

class MouseFollower
  extends AnimationFrameMixin(
    CanvasMixin(
      MouseEventsMixin<typeof PluginBase, Window>(PluginBase, {
        include: [EMouseEvent.Move, EMouseEvent.Out],
        useWindow: true,
      })
    )
  )
  implements IMouseFollower
{
  posX = 0;
  posY = 0;
  isDisabled = false;

  // Default options
  options = {
    speed: 0.18,
    radius: 10,
    color: "black",
  };

  // ATTENTION: THE PROXY OPTIONS OBJECT SHOULD NOT BE MODIFIED
  optionsProxy = null;

  constructor(container: any, options: PluginOptions) {
    super(container);
    this.setOptions(options);
    console.log(this.options);
    this.init();
  }

  init() {
    this.startAnimation();
    this.draw();
    this.resizeCanvas();
    this.addListeners();
  }

  setOptions(clientOptions: PluginOptions) {
    if (!clientOptions) return;

    const baseOptions = this.options;
    const sanitizedClientOptions = this.sanitizeObject(
      clientOptions,
      baseOptions
    );

    this.options = merge(baseOptions, sanitizedClientOptions);
    this.optionsProxy = { ...this.options };
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  draw() {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );
    this.context.beginPath();
    this.context.arc(this.posX, this.posY, this.options.radius, 0, 2 * Math.PI);
    this.context.lineWidth = 5;
    this.context.fillStyle = this.options.color;
    this.context.fill();
  }

  scaleIn() {
    gsap.to(this.options, {
      radius: this.optionsProxy.radius,
      ease: "Power3.Out",
      duration: 0.1,
    });
  }

  scaleOut() {
    gsap.to(this.options, { radius: 0, ease: "Power3.Out", duration: 0.1 });
  }

  onTick(): void {
    this.posX = this.lerp(this.posX, this.clientX, this.options.speed);
    this.posY = this.lerp(this.posY, this.clientY, this.options.speed);
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
    if (this.options.radius === 0 && !this.isDisabled) this.scaleIn();
  }

  onMouseEnter(event: MouseEvent): void {
    super.onMouseEnter(event);
  }

  onMouseOut(event: MouseEvent): void {
    console.log('mouse out!', event.currentTarget);
    super.onMouseOut(event);
    this.scaleOut();
  }

  addListeners() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    const links = DomUtils.querySelectorAll(["button", "a"]);

    links.forEach((link) => {
      link.addEventListener("mouseenter", (e) => {
        console.log('enter!', e.currentTarget);
        this.isDisabled = true;
        this.scaleOut.bind(this);
      });
      link.addEventListener("mouseleave", (e) => {
        this.isDisabled = false;
        this.scaleIn.bind(this);
      });
    });
  }
}

export default MouseFollower;
