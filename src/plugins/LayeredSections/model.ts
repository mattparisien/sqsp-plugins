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

  private _color: string = "red";
  private _radius: number = 10;
  private _tickService: AnimationFrameService;

  private _colorProxy: string = this._color;
  private _radiusProxy: number = this._radius;

  codeBlock = null;
  sections: HTMLElement[] = [];

  allowedOptions: (keyof ILayeredSectionsOptions)[] = []

  constructor(container: any, options: PluginOptions<ILayeredSectionsOptions>) {
    super(container, "");

    this.codeBlock = DomUtils.traverseUpTo(this.container, HTML_SELECTOR_MAP.get("section"));

    if (!this.codeBlock) {
      console.warn("LayeredSections: No parent section found for the plugin container.");
      return;
    }

    this.sections = DomUtils.getNextSiblings(this.codeBlock, HTML_SELECTOR_MAP.get("section"), 0);
    this.container = DomUtils.wrapSiblings(this.sections[0], "div", 0, { class: "layered-sections-container" }, true);
    this._tickService = new AnimationFrameService(this.onTick.bind(this));

  }

  protected validateOptions(options: PluginOptions<ILayeredSectionsOptions>) {
    this.setOptions(options);
  }

  onTick() { }

  init() { }

}

export default LayeredSections;
