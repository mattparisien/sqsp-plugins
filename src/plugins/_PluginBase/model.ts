import {PluginOptions} from "../_lib/ts/types";
// import { PluginOptions } from "../_lib/ts/types";
// import { merge } from "lodash";

// interface IPluginBase<T> {
//   name: string;
//   displayName: string;
//   description: string;
//   container: HTMLElement;
//   authorizedOptions: PluginOptions<T>;
//   options: Partial<PluginOptions<T>>;
//   setName(name: string): void;
//   sanitizeObject<T extends object, U extends object>(source: T, target: U): Partial<T>;
//   setOptions(userOptions: Partial<PluginOptions<T>>, authorizedOptions: PluginOptions<T>);
//   sanitizeOptions(source: Object, target: object): Partial<Object>
// }

// abstract class PluginBase<T> implements IPluginBase<T> {
//   name: string;
//   displayName: string;
//   description: string;
//   container: HTMLElement;
//   options: PluginOptions<T>;

//   abstract authorizedOptions;

//   constructor(container?: HTMLElement, options?: PluginOptions<T>) {
//     this.container = container;
//     this.options   = options;
//   }

//   setName(name: string): void {
//     this.name = name;
//   }

//   sanitizeObject<T extends object, U extends object>(source: T, target: U): Partial<T> {
//     const sanitized: Partial<T> = {};
  
//     for (const key in source) {
//       if (key in target) {
//         sanitized[key] = source[key];
//       }
//     }
  
//     return sanitized;
//   }

//   sanitizeOptions(source: Object, target: Object) {
//     return this.sanitizeObject(source, target)
//   }

//   setOptions(userOptions: Partial<PluginOptions<T>>, authorizedOptions: PluginOptions<T>) {
//     if (!userOptions) return;

//     const sanitizedUserOptions = this.sanitizeObject(
//       userOptions,
//       authorizedOptions
//     );

//     this.options = merge(authorizedOptions, sanitizedUserOptions);
//   }
// }

// export default PluginBase;
export type PluginAllowedOptions<T> = Array<keyof T>;

// Abstract class representing the base for all plugins.
abstract class PluginBase<T> {
  
  protected options: PluginOptions<T>;   // The options for the plugin instance
  protected container: HTMLElement;   // The plugin HTML container element

  protected abstract allowedOptions:  PluginAllowedOptions<T>; // The allowed plugin options


  constructor(container: HTMLElement, options: PluginOptions<T>) {
    if (new.target === PluginBase) {
      throw new TypeError("Cannot construct PluginBase instances directly");
    }
    
    this.container = container;
    this.options = this.validateOptions(options);
  }

  // Validate the provided options against the allowed options.
  // This method should be implemented by subclasses to perform specific validations.
  // Return the validated and possibly filtered options.
  protected abstract validateOptions(options: PluginOptions<T>): PluginOptions<T>;

  // Placeholder for the init method. This must be implemented by subclasses.
  public abstract init(): void;


}

export default PluginBase;
