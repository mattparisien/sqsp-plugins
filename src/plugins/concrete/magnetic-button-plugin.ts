import MagneticFeature from "../features/magnetic-feature";
import InteractiveFeature from "../features/interactive-feature";
import PluginBase from "../base/PluginBase";

class MagneticButtonPlugin extends InteractiveFeature(MagneticFeature(PluginBase)) {
    constructor(name: string, element: HTMLElement) {
      super(name);
      // Assuming the element is necessary for your logic
      this.element = element;
    }
  
    clickAction(): void {
      console.log('Button clicked with magnetic effect');
    }
  
    // Override mixin method
    onMouseEnter(event: MouseEvent): void {
      super.onMouseEnter(event);
      console.log('Mouse entered with additional behavior');
    }
  }
  

export default MagneticButtonPlugin;
