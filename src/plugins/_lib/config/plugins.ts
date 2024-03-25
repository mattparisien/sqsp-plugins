import { PluginConfiguration } from "../ts/types";
import selectorMap from "./selectorMapping";

export const pluginConfiguration: PluginConfiguration[] = [
  {
    name: "MagneticButton",
    displayName: "Magnetic Button",
    container: selectorMap.get("button"),
  },
  {
    name: "MouseFollower",
    displayName: "Mouse Follower",
    container: {
      element: "canvas",
      attributes: {
        dataset: {
          candlelightPlugin: true,
          candlelightMouseFollowerPlugin: true,
        },
      },
      appendTo: selectorMap.get("body"),
    },
  },
];
