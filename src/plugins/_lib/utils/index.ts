// Import the PluginBase class
import { PLUGIN_CONFIG, PLUGIN_MODULE_MAPPING } from "../constants/index";
import { PluginConfiguration } from "../ts/types";

async function getPluginClass(className) {
  const importer = PLUGIN_MODULE_MAPPING[className];
  if (!importer) {
    return console.error(`Unknown class name: ${className}`);
  }
  const ClassModule = await importer();
  return ClassModule.default;
}

async function getPluginConfig(
  pluginName: string
): Promise<PluginConfiguration> {
  // Dynamically import the JSON configuration based on the class name
  const configObj = PLUGIN_CONFIG.find((x) => x.name === pluginName);
  return configObj;
}

export async function initializePlugin(pluginName: string): Promise<void> {
  window.addEventListener("load", async () => {
    const Class = await getPluginClass(pluginName);
    const config = await getPluginConfig(pluginName);

    if (!Class) {
      return console.error(
        `Unable to load class. Plugin ${pluginName} not found.`
      );
    }

    const elements = Array.from(document.querySelectorAll(config.selector));

    if (Object.values(elements)?.length > 0) {
      elements.forEach((element) => {
        new Class(element as HTMLElement, config);
      });
    }
  });
}
