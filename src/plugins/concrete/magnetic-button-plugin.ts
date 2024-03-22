import MagneticFeature from "../features/magnetic-feature";
import InteractiveFeature from "../features/interactive-feature";
import PluginBase from "../base/PluginBase";

class MagneticButtonPlugin extends InteractiveFeature(
  MagneticFeature(PluginBase)
) {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.element = element;
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

export default MagneticButtonPlugin;
