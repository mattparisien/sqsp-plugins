import {
  CanvasMixin,
  AnimationFrameMixin,
  InteractiveMixin,
} from "../_lib/mixins";
import { PluginConfiguration } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

interface IMouseFollower {
  init(): void;
}

class MouseFollower
  extends AnimationFrameMixin(CanvasMixin(InteractiveMixin(PluginBase)))
  implements IMouseFollower
{
  constructor(container: any, config: PluginConfiguration) {
    super(container, config);
    this.init();
  }

  init() {
    this.startAnimation();
  }

  onTick(): void {
    console.log("animation is going!");
  }

  onMouseMove(event: MouseEvent): void {
    
  }
}

export default MouseFollower;
