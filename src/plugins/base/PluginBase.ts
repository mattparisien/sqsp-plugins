import { IPlugin } from "../interfaces";

abstract class PluginBase implements IPlugin {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  destroy(): void {}
}

export default PluginBase;
