import { MagneticService, MouseEventsService } from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import PluginBase, { PluginAllowedOptions } from "../_PluginBase/model";

interface IMagneticButtonOptions {
  strength: number;
}

class MagneticButton extends PluginBase<IMagneticButtonOptions> {
  private magneticService;
  private mouseEventsService;

  allowedOptions: PluginAllowedOptions<IMagneticButtonOptions> = ["strength"];

  constructor(container: any, options: PluginOptions<IMagneticButtonOptions>) {
    super(container, options);

    this.magneticService    = new MagneticService();
    this.mouseEventsService = new MouseEventsService(this.container, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove,
      },
      {
        event: EMouseEvent.Leave,
        handler: this.onMouseLeave,
      },
    ]);
  }

  public init(): void {

  }

  protected validateOptions(
    options: PluginOptions<IMagneticButtonOptions>
  ): PluginOptions<IMagneticButtonOptions> {
    const validatedOptions = {};

    Object.entries(options).forEach((entry) => {
      this.allowedOptions.forEach((allowedOption) => {
        if (entry[0] === allowedOption) {
          validatedOptions[allowedOption] = entry[1];
        }
      });
    });

    return validatedOptions as PluginOptions<IMagneticButtonOptions>;
  }

  onMouseMove(event: MouseEvent): void {
    this.magneticService.applyMagneticEffect(
      this.container,
      this.mouseEventsService.clientX,
      this.mouseEventsService.clientY
    );
  }

  onMouseLeave(event: MouseEvent): void {
    this.magneticService.removeMagneticEffect(this.container);
  }
}

export default MagneticButton;
