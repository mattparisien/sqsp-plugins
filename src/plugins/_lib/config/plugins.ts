import { PluginConfiguration } from "../ts/types";
import selectorMap from "./selectorMapping";

export const pluginConfiguration: PluginConfiguration[] = [
  {
    name: "MagneticButton",
    displayName: "Magnetic Button",
    tree: selectorMap.get("button"),
    isActive: false,
    module: () => import("../../MagneticButton/model"),
  },
  {
    name: "MouseFollower",
    displayName: "Mouse Follower",
    module: () => import("../../MouseFollower/model"),
    isActive: false,
    tree: {
      element: "canvas",
      appendTo: selectorMap.get("body"),
    },
  },
  {
    name: "ImageTrailer",
    displayName: "Image Trailer",
    module: () => import("../../ImageTrailer/model"),
    isActive: true,
    tree: selectorMap.get("section")
  }
];
