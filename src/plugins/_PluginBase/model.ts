import {PluginOptions} from "../_lib/ts/types";


export type PluginAllowedOptions<T> = Array<keyof T>;

// Abstract class representing the base for all plugins.
abstract class PluginBase<T> {
  
  
  protected container: HTMLElement;   // The plugin HTML container element

  protected abstract options: PluginOptions<T>;   // The options for the plugin instance

  constructor(container: HTMLElement) {
    if (new.target === PluginBase) {
      throw new TypeError("Cannot construct PluginBase instances directly");
    }
    
    this.container = container;
  }

  // Validate the provided options against the allowed options.
  // This method should be implemented by subclasses to perform specific validations.
  // Return the validated and possibly filtered options.
  protected abstract validateOptions(userOptions: Partial<PluginOptions<T>>, defaultOptions: PluginOptions<T>): PluginOptions<T>;

  // Placeholder for the init method. This must be implemented by subclasses.
  public abstract init(): void;


  // Merges the options passed in to the derived constructor with the 
  // This method should ideally be called by all derived classes inside the validateOptions method
  protected mergeOptions(userOptions: Partial<PluginOptions<T>>, defaultOptions: PluginOptions<T>) : PluginOptions<T> {
    const mergedOptions = defaultOptions;

    Object.entries(userOptions).forEach((entry) => {
      Object.keys(defaultOptions).forEach((defaultOptions) => {
        if (entry[0] === defaultOptions) {
          mergedOptions[defaultOptions] = entry[1];
        }
      });
    });

    return mergedOptions as PluginOptions<T>;
  } 
}

export default PluginBase;
