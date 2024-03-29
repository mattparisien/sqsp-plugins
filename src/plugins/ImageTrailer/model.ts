import { MouseEventsService } from "../_lib/services";
import ImageService from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IImageTrailerOptions {
  imageUrls: string[];
}

type TAnimatableImage = {
  image: HTMLElement;
  isAnimating: boolean;
};

class ImageTrailer extends PluginBase<IImageTrailerOptions> {
  private _images: TAnimatableImage[] = [];
  private _mouseEventsService: MouseEventsService;
  private _imageService: ImageService;
  private _actionInterval: number | null = null;
  private _debounceTimeout: number | null = null;
  private _actionIntervalTime = 200; // nth number of seconds (5000ms = 5 seconds)
  private _debounceIntervalTime = 1000;
  private _isMouseMoving = false;
  private _currImageIdx = 0;

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
    console.log(this);
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

      this._images.push({
        image: imageWrapper,
        isAnimating: false,
      });
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

  onMouseMove(event: MouseEvent): void {
    if (!this._isMouseMoving) {
      this._isMouseMoving = true;
      this.startActionInterval();
    }

    // Clear any existing debounce timeout
    if (this._debounceTimeout !== null) {
      clearTimeout(this._debounceTimeout);
    }
    // Set a new debounce timeout
    this._debounceTimeout = window.setTimeout(() => {
      this._isMouseMoving = false;
      this.stopActionInterval();
    }, this._debounceIntervalTime);
  }

  private startActionInterval(): void {
    this.stopActionInterval(); // Ensure no intervals are already running
    this._actionInterval = window.setInterval(() => {
      this.performAction();
    }, this._actionIntervalTime);
  }

  private stopActionInterval(): void {
    if (this._actionInterval !== null) {
      clearInterval(this._actionInterval);
      this._actionInterval = null;
    }
  }

  private performAction(): void {
    if (!this._images[this._currImageIdx].isAnimating) {
      this.animateImage(this._currImageIdx);

      if (this._currImageIdx === this._images.length - 1)
        this._currImageIdx = 0;
      else this._currImageIdx += 1;
    }
  }

  private animateImage(imageIdx: number) {
    const obj = this._images[imageIdx];
    obj.image.style.left = this._mouseEventsService.clientX + "px";
    obj.image.style.top = this._mouseEventsService.clientY + "px";
  }
}

export default ImageTrailer;
