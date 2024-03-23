import {
  CanvasMixin,
  AnimationFrameMixin,
  InteractiveMixin,
} from "../_lib/mixins";
import { PluginConfiguration } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

interface IMouseFollower {
  posX: number;
  posY: number;
  radius: number;
  color: string;
  lerpAmt: number;
  init(): void;
  lerp(start: number, end: number, amount: number): number;
}

class MouseFollower
  extends AnimationFrameMixin(CanvasMixin(InteractiveMixin(PluginBase, true)))
  implements IMouseFollower
{
  posX = 0;
  posY = 0;
  lerpAmt = 0.1;
  radius = 10;
  color = "red";

  constructor(container: any, config: PluginConfiguration) {
    super(container, config);
    this.init();
  }

  init() {
    this.startAnimation();
    this.draw();
    this.resizeCanvas();
    this.addResizeListener();
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

  onTick(): void {
    this.posX = this.lerp(this.posX, this.clientX, this.lerpAmt);
    this.posY = this.lerp(this.posY, this.clientY, this.lerpAmt);
    this.draw();
  }

  onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
  }

  addResizeListener() {
    window.addEventListener("resize", this.resizeCanvas.bind(this));
  }
}

export default MouseFollower;
