import PluginBase from "../../_PluginBase/model";

export interface IPluginBaseConstructor {
  new (element: HTMLElement): PluginBase;
}
