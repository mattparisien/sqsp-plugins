import { HTML_SELECTOR_MAP, SQSP_BLOCK_SELECTOR_MAP } from "../_lib/config/domMappings";
import {
  AnimationFrameService,
  CanvasService,
  MouseEventsService,
} from "../_lib/services";
import { PluginOptions } from "../_lib/ts/types";
import ArrayUtils from "../_lib/utils/ArrayUtils";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface ILayeredSectionsOptions {

}

interface ILayeredSections {
  codeBlock: HTMLElement | null;
  init(): void;

}

class LayeredSections
  extends PluginBase<ILayeredSectionsOptions>
  implements ILayeredSections {
  private _canvasService: CanvasService;
  private _tickService: AnimationFrameService;
  private _mouseEventsService: MouseEventsService;
  private _mouseMoveDebounceId: any = null;
  private _mouseMoveDebounceMs: number = 100;
  private _partyTimerId: any = null;
  private _partyTimerMs: number = 500;

  private _color: string = "red";
  private _radius: number = 10;
  private _speed: number = 0.1;
  private _palette: string[] = ArrayUtils.shuffle([
    "#61833C",
    "#DC8D82",
    "#B32C2A",
    "#DC969E",
    "#CFCDC4",
    "#507941",
    "#CC7A3B",
    "#7092AD",
    "#AF6530",
    "#F2AC0A",
    "#F3D5B6",
    "#B0A336",
    "#AD9AB0",
  ]);

  private _colorProxy: string = this._color;
  private _radiusProxy: number = this._radius;

  codeBlock = null;
  sections: HTMLElement[] = [];

  allowedOptions: (keyof ILayeredSectionsOptions)[] = []

  constructor(container: any, options: PluginOptions<ILayeredSectionsOptions>) {
    super(container, "");

    this.codeBlock = DomUtils.traverseUpTo(this.container, SQSP_BLOCK_SELECTOR_MAP.get("code"));
    this.sections = DomUtils.getNextSiblings(this.codeBlock, HTML_SELECTOR_MAP.get("section"), 2);

    console.log(this.sections);

    this._tickService = new AnimationFrameService(this.onTick.bind(this));

  }

  protected validateOptions(options: PluginOptions<ILayeredSectionsOptions>) {
    this.setOptions(options);
  }

  onTick() { }

  init() { }

}

export default LayeredSections;
