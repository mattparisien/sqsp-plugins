import { MagneticMixin } from "../_lib/mixins";

/**
 * @summary Model for the Magnetic Button plugin
 * The magnetic button becomes magnetic once the user hovers over the element
 */
class MagneticButton extends MagneticMixin(PluginBase){
  // Specify allowed options for this plugin
  private allowedOptions: string[] = ["strength"];

  constructor(container: HTMLElement, options: PluginOptions) {
    super(container, options);
  }

  // Implement the abstract validateOptions method to only allow specific options
  protected validateOptions(options: PluginOptions): PluginOptions {
    const validatedOptions: PluginOptions = {};
    Object.keys(options).forEach((key) => {
      if (this.allowedOptions.includes(key)) {
        validatedOptions[key] = options[key];
      } else {
        console.warn(`Option "${key}" is not allowed and will be ignored.`);
      }
    });
    return validatedOptions;
  }

  // Implement the required init method
  public init(): void {
    console.log("MagneticButton initialized with options:", this.options);
  }
}

export default MagneticButton
