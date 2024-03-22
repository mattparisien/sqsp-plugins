import PluginBase from "./PluginBase";

class PluginManager<T extends PluginBase> {
  private selector: string;
  private pluginConstructor: new (element: HTMLElement) => T;

  constructor(
    selector: string,
    pluginConstructor: new (element: HTMLElement) => T
  ) {
    this.selector = selector;
    this.pluginConstructor = pluginConstructor;
  }

  public applyPlugins(): void {
    const elements = document.querySelectorAll<HTMLElement>(this.selector);
    elements.forEach((element) => new this.pluginConstructor(element));
  }
}

export default PluginManager;
