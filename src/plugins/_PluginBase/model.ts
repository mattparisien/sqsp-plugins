import { PluginConfiguration } from "../_lib/ts/types";

interface IPluginBase {
  name: string;
  displayName: string;
  description: string;
  container: HTMLElement;
  setName(name: string): void;
}

class PluginBase implements IPluginBase {
  name: string;
  displayName: string;
  description: string;
  container: HTMLElement;

  constructor(container?: HTMLElement, configuration?: PluginConfiguration) {
    if (container) {
      this.container = container;
    }

    if (configuration && Object.values(configuration)?.length) {
      this.name = configuration?.name;
      this.displayName = configuration?.displayName;
      this.description = configuration?.description;
    }
  }

  setName(name: string): void {
    this.name = name;
  }
}

export default PluginBase;
