import { MagneticMixin, MouseEventsMixin } from "../_lib/mixins";
import { PluginOptions } from "../_lib/ts/types";
import PluginBase from "../_PluginBase/model";

interface IMagneticButtonOptions {
  strength: number;
}

class MagneticButton extends MouseEventsMixin(MagneticMixin(PluginBase<IMagneticButtonOptions>)) {
  constructor(container: any, options: PluginOptions<IMagneticButtonOptions>) {
    super(container, options);
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
