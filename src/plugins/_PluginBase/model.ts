import { PluginOptions } from "../_lib/ts/types";

interface IPluginBase<T> {
  name: string;
  displayName: string;
  description: string;
  container: HTMLElement;
  options: PluginOptions<T>;
  setName(name: string): void;
  sanitizeObject<T extends object, U extends object>(source: T, target: U): Partial<T>;
  sanitizeOptions(source: Object, target: object): Partial<Object>
}

abstract class PluginBase<T> implements IPluginBase<T> {
  name: string;
  displayName: string;
  description: string;
  container: HTMLElement;
  options: PluginOptions<T>;

  constructor(container?: HTMLElement, options?: PluginOptions<T>) {
    this.container = container;
    this.options   = options;
  }

  setName(name: string): void {
    this.name = name;
  }

  sanitizeObject<T extends object, U extends object>(source: T, target: U): Partial<T> {
    const sanitized: Partial<T> = {};
  
    for (const key in source) {
      if (key in target) {
        sanitized[key] = source[key];
      }
    }
  
    return sanitized;
  }

  sanitizeOptions(source: Object, target: Object) {
    return this.sanitizeObject(source, target)
  }
}

export default PluginBase;
