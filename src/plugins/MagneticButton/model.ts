import { MagneticMixin, InteractiveMixin } from "../_lib/mixins";
import { PluginConfiguration } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

class MagneticButton extends InteractiveMixin(MagneticMixin(PluginBase)) {
  constructor(element: HTMLElement, config: PluginConfiguration) {
    super(element);
    
    this.setPluginConfig(config);
    this.setPluginAttributes(this.name);
  }

  onMouseMove(event: MouseEvent): void {
    super.onMouseMove(event);
    this.applyMagneticEffect(this.element, this.clientX, this.clientY);
  }

  onMouseLeave(event: MouseEvent): void {
    super.onMouseLeave(event);
    this.removeMagneticEffect(this.element);
  }
}

export default MagneticButton;
