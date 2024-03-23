/**
 * @summary Configuration types
 */

export type Constructor = new (...args: any[]) => {};

export type AbstractConstructor<T = {}> = Function & { prototype: T };

export type AnyConstructor<T = {}> = Constructor | AbstractConstructor<T>;

export type PluginElement = HTMLElement;

export type HTMLSelector = string;

export type PluginSelector = HTMLSelector;

export type ElementContainerCreator = {
  element: string;
  attributes: {
    [key: string]:
      | string
      | number
      | boolean
      | {
          [key: string]: string | number | boolean;
        };
  };
  appendTo: HTMLSelector;
};

export type PluginConfigurationContainer =
  | HTMLSelector
  | ElementContainerCreator;

export type PluginConfiguration = {
  name: string;
  displayName: string;
  description?: string;
  container: PluginConfigurationContainer;
};

/**
 * @summary UI types
 */

export type PluginContainer = HTMLElement | ElementContainerCreator;
