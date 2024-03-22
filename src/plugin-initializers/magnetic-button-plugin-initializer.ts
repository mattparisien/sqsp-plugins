import PluginManager from "../plugins/base/PluginManager";
import MagneticButtonPlugin from "../plugins/concrete/magnetic-button-plugin";
import pluginRegistry from "../lib/config/pluginRegistry";
import { onLoad } from "../lib/utils";

onLoad(
  () =>
    new PluginManager(
      pluginRegistry.get(MagneticButtonPlugin),
      MagneticButtonPlugin
    )
);
