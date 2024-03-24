import MODULE_MAPPING from "../config/moduleMapping";
import { PLUGIN_CONFIGURATION } from "../config/plugins";
import {
  ElementContainerCreator, PluginConfiguration,
  PluginConfigurationContainer
} from "../ts/types";

async function getPluginClass(className: string): Promise<any> {
  const importer = MODULE_MAPPING[className];
  if (!importer) {
    console.error(`Unknown class name: ${className}`);
    return undefined;
  }
  const ClassModule = await importer();
  return ClassModule.default;
}

function getPluginConfig(pluginName: string): PluginConfiguration {
  return PLUGIN_CONFIGURATION.find((config) => config.name === pluginName);
}

function getPluginContainers(
  container: PluginConfigurationContainer
): HTMLElement | HTMLElement[] {
  let ret: HTMLElement | HTMLElement[];

  if (!container) {
    throw new Error("Plugin container cannot be null or undefined");
  }

  if (typeof container === "string") {
    ret = Array.from(document.querySelectorAll(container as string));
  } else if (typeof container === "object") {
    const el = document.createElement(
      (container as ElementContainerCreator)["element"]
    );
    const parent = document.querySelector(
      (container as ElementContainerCreator)["appendTo"]
    );

    if (!parent) {
      throw new Error(
        "Must pass a valid parent container selector for dynamically created containers"
      );
    }

    if (
      Object.values((container as ElementContainerCreator).attributes)?.length >
      0
    ) {
      Object.entries((container as ElementContainerCreator).attributes).forEach(
        (entry) => {
          if (typeof entry[1] !== "object") {
            el[entry[0]] = entry[1];
          } else {
            Object.entries(entry[1]).forEach((entry2) => {
              el[entry[0]][entry2[0]] = true;
            });
          }
        }
      );
    }

    parent.appendChild(el);
    ret = el;
  } else {
    throw new Error("Unidentifiable plugin container type");
  }
  return ret;
}

export async function initializePlugin(pluginName: string): Promise<void> {
  window.addEventListener("load", async () => {
    const Class = await getPluginClass(pluginName);
    const config = await getPluginConfig(pluginName);

    if (!Class || !config) {
      return console.error(
        `Unable to load class or config. Plugin ${pluginName} not found.`
      );
    }

    const containers = getPluginContainers(config.container);

    if (!containers) {
      return console.error(
        `Unable to extract HTML container(s) for plugin ${pluginName}`
      );
    }

    if (Array.isArray(containers) && containers.length > 0) {
      containers.forEach((container) => {
        new Class(container, config);
      });
    } else {
      new Class(containers as HTMLElement, config);
    }
  });
}
