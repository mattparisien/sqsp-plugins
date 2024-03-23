import { PluginConfiguration } from "../ts/types";

export const PLUGIN_CONFIGURATION: PluginConfiguration[] = [
  {
    name: "MagneticButton",
    displayName: "Magnetic Button",
    container: ".sqs-button-block",
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
      appendTo: "body",
    },
  },
];
