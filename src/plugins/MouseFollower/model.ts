import {
  CanvasMixin,
  AnimationFrameMixin,
  MouseEventsMixin,
} from "../_lib/mixins";
import { PluginConfiguration } from "../_lib/ts/types";
import selectorMap from "../_lib/config/selectorMapping";
import { EMouseEvent } from "../_lib/mixins/MouseEventsMixin";
import PluginBase from "../_PluginBase/model";
import gsap from "gsap";
import DomUtils from "../_lib/utils/DomUtils";

interface IMouseFollower {
  posX: number;
  posY: number;
  radius: number;
  radiusProxy: number;
  color: string;
  lerpAmt: number;
  isDisabled: boolean;
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
  lerpAmt = 0.18;
  radius = 10;
  isDisabled = false;
  radiusProxy = this.radius;
  color = "red";

  constructor(container: any, config: PluginConfiguration) {
    super(container, config);
    this.init();
  }

  init() {
    this.startAnimation();
    this.draw();
    this.resizeCanvas();
    this.addListeners();
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
    this.context.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
    this.context.lineWidth = 5;
    this.context.fillStyle = this.color;
    this.context.fill();
  }

  scaleIn() {
    gsap.to(this, {
      radius: this.radiusProxy,
      ease: "Power3.Out",
      duration: 0.1,
    });
  }

  scaleOut() {
    gsap.to(this, { radius: 0, ease: "Power3.Out", duration: 0.1 });
  }

  onTick(): void {
    this.posX = this.lerp(this.posX, this.clientX, this.lerpAmt);
    this.posY = this.lerp(this.posY, this.clientY, this.lerpAmt);
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
    if (this.radius === 0 && !this.isDisabled) this.scaleIn();
  }

  onMouseEnter(event: MouseEvent): void {
    super.onMouseEnter(event);
  }

  onMouseOut(event: MouseEvent): void {
    super.onMouseOut(event);
    this.scaleOut();
  }

  addListeners() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    const buttons = DomUtils.querySelectorAll(selectorMap.get("button"));

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", (e) => {
        this.isDisabled = true;
        this.scaleOut.bind(this);
      });
      button.addEventListener("mouseleave", (e) => {
        this.isDisabled = false;
        this.scaleIn.bind(this);
      });
    });
  }
}

export default MouseFollower;
