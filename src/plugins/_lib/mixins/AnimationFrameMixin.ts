import { Constructor } from "../ts/types";

interface IAnimationFrame {
  startAnimation(): void;
  stopAnimation(): void;
  onTick(): void;
}

function AnimationFrameMixin<T extends Constructor>(Base: T) {
  return class extends Base implements IAnimationFrame {
    private animationFrameId: number | null = null;

    constructor(...args: any[]) {
      const element = args[0];
      super(element as HTMLElement);
    }

    startAnimation(): void {
      if (this.animationFrameId === null) {
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
      }
    }

    stopAnimation(): void {
      if (this.animationFrameId !== null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    private animate(time: number): void {
      this.onTick();

      this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    onTick(): void {}
  };
}

export default AnimationFrameMixin;
