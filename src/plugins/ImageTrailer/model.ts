import { MouseEventsService } from "../_lib/services";
import ImageService from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IImageTrailerOptions {
  imageUrls: string[];
}

class ImageTrailer extends PluginBase<IImageTrailerOptions> {
  private _mouseEventsService: MouseEventsService;
  private _imageService: ImageService;

  private elements: HTMLElement[] = [];

  options: PluginOptions<IImageTrailerOptions> = {
    imageUrls: [],
  };

  constructor(container: any, options: PluginOptions<IImageTrailerOptions>) {
    super(container, "Image Trailer");

    this.options = this.validateOptions(options);

    this._imageService = new ImageService(
      options.imageUrls.map((url) => ({
        src: url,
        aspect: EAspectRatio.Square,
        onLoad: this.onImageLoad.bind(this),
        onError: this.onImageLoadError.bind(this),
      }))
    );

    this._mouseEventsService = new MouseEventsService(this.container, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
    ]);
  }

  init(): void {
    this._imageService.init();
    this._mouseEventsService.init();
    this.appendImages();
  }

  private onImageLoad() {}

  private onImageLoadError() {}

  private appendImages() {
    this._imageService.getImageDetails().forEach((detail) => {
      const imageWrapper = DomUtils.addClass(
        DomUtils.wrapElement(
          DomUtils.addClass(DomUtils.wrapElement(detail.node, "div"), [
            "trailer-image-inner",
          ]),
          "div"
        ),
        ["trailer-image", `aspect-${detail.aspect}`]
      );

      this.container.appendChild(imageWrapper);
    });
  }

  protected validateOptions(
    options: PluginOptions<IImageTrailerOptions>
  ): PluginOptions<IImageTrailerOptions> {
    if (!options.imageUrls || !options.imageUrls.length) {
      throw new Error("Missing required option 'imageUrls'");
    }

    options.imageUrls = (options.imageUrls as unknown as string).split(",");

    const mergedOptions = this.mergeOptions(options, this.options);
    return mergedOptions;
  }

  onMouseMove(event: MouseEvent): void {}
}

export default ImageTrailer;
