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
      appendTo: selectorMap.get("body"),
    },
  },
  {
    name: "ImageTrailer",
    displayName: "Image Trailer",
    tree: selectorMap.get("section"),
    module: () => import("../../ImageTrailer/model")
  }
];
