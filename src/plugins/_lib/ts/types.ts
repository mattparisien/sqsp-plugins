/**
 * @summary Configuration types
 */

export type Constructor = new (...args: any[]) => {};

export type AbstractConstructor<T = {}> = Function & { prototype: T };

export type AnyConstructor<T = {}> = Constructor | AbstractConstructor<T>;

export type PluginElement = HTMLElement;

export type HTMLSelector = string;

export type PluginSelector = HTMLSelector;

export type ElementCreator = {
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

/**
 * @summary The plugins root element, can either be a selector
 * or take a custom object
 */
export type PluginRootElement = HTMLSelector | ElementCreator;

export type PluginConfiguration = {
  name: string;
  displayName: string;
  description?: string;
  container: PluginRootElement;
};

/**
 * @summary UI types
 */

export type PluginContainer = HTMLElement | ElementCreator;
