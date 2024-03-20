import { IPlugin } from "../interfaces";

abstract class PluginBase implements IPlugin {
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  initialize(): void {
    console.log(`${this.name} initialized`);
  }

  destroy(): void {
    console.log(`${this.name} destroyed`);
  }
}

export default PluginBase;
