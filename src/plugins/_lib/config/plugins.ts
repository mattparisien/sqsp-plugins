import { PluginConfiguration } from "../ts/types";
import selectorMap from "./selectorMapping";

export const pluginConfiguration: PluginConfiguration[] = [
  {
    name: "MagneticButton",
    displayName: "Magnetic Button",
    tree: selectorMap.get("button"),
    module: () => import("../../MagneticButton/model"),
  },
  {
    name: "MouseFollower",
    displayName: "Mouse Follower",
    module: () => import("../../MouseFollower/model"),
    tree: {
      element: "canvas",
      attributes: {
        dataset: {
          candlelightPlugin: true,
          candlelightMouseFollowerPlugin: true,
        },
      },
      children: [
        {
          element: "div",
          attributes: {
            class: "hi"
          }
        }
      ],
      appendTo: selectorMap.get("body"),
    },
  },
];
