import { pluginConfiguration } from "../config/plugins";
import { ElementTree, HTMLSelector, PluginConfiguration } from "../ts/types";
import DomUtils from "./DomUtils";

const encodeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const getPluginOptionsFromScript = (script: HTMLOrSVGScriptElement) => {
  const options = {};
  const dataAttributes = script?.dataset;

  if (!dataAttributes) return;

  for (const [key, value] of Object.entries(dataAttributes)) {
    options[key] = encodeHTML(value);
  }

  return options;
};

function getPluginConfig(pluginName: string): PluginConfiguration {
  return pluginConfiguration.find((config) => config.name === pluginName);
}

function getContainersBySelector(
  selector: HTMLSelector
): HTMLElement | HTMLElement[] {
  return DomUtils.querySelectorAll(selector);
}

const createTree = (structure: ElementTree): HTMLElement => {
  if (!structure) {
    throw new Error("createTree: Structure argument missing");
  }

  // Create the element
  const element = document.createElement(structure.element);

  // Apply attributes
  if (structure.attributes) {
    for (const [attr, value] of Object.entries(structure.attributes)) {
      if (attr === "dataset") {
        // Special handling for dataset
        for (const [dataKey, dataValue] of Object.entries(value)) {
          element.dataset[dataKey] = dataValue;
        }
      } else {
        element.setAttribute(attr, value as string);
      }
    }
  }

  // Recursively process children
  if (structure.children) {
    for (const child of structure.children) {
      const childElement = createTree(child as ElementTree);
      if (childElement) {
        element.appendChild(childElement as HTMLElement);
      }
    }
  }

  // Append to specified parent, if any
  if (structure.appendTo) {
    const container = DomUtils.querySelector(structure.appendTo);

    if (!container) {
      throw new Error(
        "createTree: could not identify container elememt to append tree to."
      );
    }

    container.appendChild(element as HTMLElement);
  }

  return element;
};

const isHTMLSelector = (selector: string | Object): boolean => {
  return typeof selector === "string";
};

export async function initializePlugin(pluginName: string): Promise<void> {
  const script: HTMLOrSVGScriptElement = document.currentScript;

  window.addEventListener("load", async () => {
    try {
      let options, module, Class, config: PluginConfiguration, containerNodes;

      options = getPluginOptionsFromScript(script);
      config = await getPluginConfig(pluginName); // Get the configuration object
      module = await config.module(); // Load the module from configuration
      Class = await module.default; // Get the module's default exported value (the class)

      if (!Class || !config) {
        throw new Error(
          `Error loading class or config. Plugin ${pluginName} not found.`
        );
      }

      if (isHTMLSelector(config.tree)) {
        containerNodes = getContainersBySelector(config.tree as HTMLSelector);
      } else {
        containerNodes = createTree(config.tree as ElementTree);
      }

      if (!containerNodes || !containerNodes.length) {
        throw new Error(
          `Error finding/creating container node(s) for plugin ${pluginName}`
        );
      }

      if (Array.isArray(containerNodes) && containerNodes.length > 0) {
        containerNodes.forEach((container) => {
          new Class(container, options);
        });
      } else {
        new Class(containerNodes as HTMLElement, options);
      }
    } catch (err) {
      console.error(err);
    }
  });
}
