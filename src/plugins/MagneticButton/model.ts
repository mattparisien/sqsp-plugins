import { MagneticMixin, InteractiveMixin } from "../_lib/mixins";
import { PluginConfiguration } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

class MagneticButton extends InteractiveMixin(MagneticMixin(PluginBase)) {
  constructor(container: any, config: PluginConfiguration) {
    super(container, config);
  }

  onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
    this.applyMagneticEffect(this.container, this.clientX, this.clientY);
  }

  onMouseLeave(event: MouseEvent): void {
    super.onMouseLeave(event);
    this.removeMagneticEffect(this.container);
  }
}

export default MagneticButton;
