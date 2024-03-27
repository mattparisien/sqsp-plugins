interface IAnimationFrameService {
  startAnimation(): void;
  stopAnimation(): void;
  onTick(timestamp: number): void;
}

class AnimationFrameService implements IAnimationFrameService {
  private animationFrameId: number | null = null;
  private onTickCallback: (timestamp: number) => void;

  constructor(onTickCallback?: (timestamp: number) => void) {
    this.onTickCallback = onTickCallback || ((timestamp: number) => {});
  }

  startAnimation(): void {
    if (this.animationFrameId === null) {
      const animate = (time: number) => {
        this.onTick(time);
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    }
  }

  stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  onTick(timestamp: number): void {
    this.onTickCallback(timestamp);
  }
}

export default AnimationFrameService;
