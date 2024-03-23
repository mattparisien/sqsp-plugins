import { COMPANY_NAME_LOWER } from "../_lib/constants";
import { uniqueId } from "lodash";
import { PluginConfiguration } from "../_lib/ts/types";

export interface IPluginBaseConstructor {
  new (element: HTMLElement): PluginBase;
}

class PluginBase {
  protected element     : HTMLElement;

  protected name        : string;
  protected displayName : string;
  protected selector    : string;
  protected description : string;

  constructor(element: HTMLElement) {
    this.setElement(element);
  }

  protected setName(name: string): void {
    this.name = name;
  }

  protected setElement(el: HTMLElement): void {
    this.element = el;
  }

  protected setPluginAttributes(name: string): void {
    this.element.dataset[COMPANY_NAME_LOWER + "Plugin"] = "true";
    this.element.dataset[
      COMPANY_NAME_LOWER + name.split(" ").join("") + "Plugin"
    ] = uniqueId("p");
  }

  protected setPluginConfig(config: PluginConfiguration) {
    this.name        = config.name;
    this.displayName = config.displayName;
    this.selector    = config.selector;
    this.description = config.description;
  }
}

export default PluginBase;
