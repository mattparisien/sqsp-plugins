import { MagneticService, MouseEventsService } from "../_lib/services";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { PluginOptions } from "../_lib/ts/types";
import PluginBase, { PluginAllowedOptions } from "../_PluginBase/model";

interface IMagneticButtonOptions {
  strength: number;
}

class MagneticButton extends PluginBase<IMagneticButtonOptions> {
  private _magneticService: MagneticService;
  private _mouseEventsService: MouseEventsService;

  allowedOptions: PluginAllowedOptions<IMagneticButtonOptions> = ["strength"];

  constructor(container: any, options: PluginOptions<IMagneticButtonOptions>) {
    super(container, options);

    this.options = this.validateOptions(options);
    this._magneticService = new MagneticService();
    this._mouseEventsService = new MouseEventsService(this.container, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
      {
        event: EMouseEvent.Leave,
        handler: this.onMouseLeave.bind(this),
      },
    ]);
  }

  init(): void {
    this._magneticService.init();
    this._mouseEventsService.init();
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
    this._magneticService.applyMagneticEffect(
      this.container,
      this._mouseEventsService.clientX,
      this._mouseEventsService.clientY
    );
  }

  onMouseLeave(event: MouseEvent): void {
    this._magneticService.removeMagneticEffect(this.container);
  }
}

export default MagneticButton;
