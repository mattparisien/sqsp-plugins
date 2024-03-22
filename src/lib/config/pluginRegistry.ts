import MagneticButtonPlugin from "../../plugins/concrete/magnetic-button-plugin";
import PluginBase from "../../plugins/base/PluginBase";

type PluginRegistry = Map<new (element: HTMLElement) => PluginBase, string>;

const pluginRegistry: PluginRegistry = new Map();
pluginRegistry.set(MagneticButtonPlugin, ".sqs-block-button");

export default pluginRegistry;
