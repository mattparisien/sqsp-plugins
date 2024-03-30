import { MouseEventsService } from "../_lib/services";
import ImageService, { IImageDetails } from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";
import gsap from "gsap";

interface IImageTrailerOptions {
  imageUrls: string[];
}

interface IAnimatableImage {
  node: HTMLElement;
  isAnimating: boolean;
  gsap: {
    fadeOutTimeline: GSAPTimeline;
  };
}

class ImageTrailer extends PluginBase<IImageTrailerOptions> {
  // #region Private members

  // The aspect ratio for the images
  private readonly _imageAspect: EAspectRatio = EAspectRatio.Portrait;

  // Services needed for this plugin
  private _images: IAnimatableImage[] = [];
  private _mouseEventsService: MouseEventsService;
  private _imageService: ImageService;

  // Whether the mouse is currently moving
  private _isMouseMoving = false;

  // Whether the image is currently moving
  private _isImageMoving = true;

  // The amount of time an image should fade
  private _imageFadeDuration = 2;

  // The amount of time elapsed before a new image appears
  private _imageIntervalDuration: number = 100;

  // How quickly to set _isMouseMoving to false after the user stops moving mouse
  private _debounceTimeoutDuration: number = 1000;

  // Tracking the timeout id
  private _debounceTimeoutId: any = null;

  // Tracking the interval id
  private _imageIntervalId: any = null;

  // Tracking the current image index
  private _currImageIdx = 0;

  // #endregion

  options: PluginOptions<IImageTrailerOptions> = {
    imageUrls: [],
  };

  constructor(container: any, options: PluginOptions<IImageTrailerOptions>) {
    super(container, "Image Trailer");

    this.options = this.validateOptions(options);

    this._imageService = new ImageService(
      options.imageUrls.map((url) => ({
        src: url,
        aspect: this._imageAspect,
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
    this._imageService
      .init()
      .then((imageDetails: IImageDetails[]) => {
        console.log(imageDetails);
        this.appendImages(imageDetails);
        this._mouseEventsService.init();
      })
      .catch((err) => console.error("One or more images were not loaded"));
  }

  private onImageLoad() {}

  private onImageLoadError() {}

  private appendImages(imageDetails: IImageDetails[]) {
    imageDetails.forEach((detail) => {
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
<<<<<<< HEAD
        node: imageWrapper,
        isAnimating: false,
        gsap: {
          fadeOutTimeline: this.createFadeOutTimeline(imageWrapper),
        },
=======
        image: imageWrapper,
        isAnimating: false,
>>>>>>> 8d91833493c500f561cf0d4e1ec50604a995e64c
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
    this.animateOnMouseMove();
  }

  private animateOnMouseMove() {
    this.moveImage(this._currImageIdx);

    this._isMouseMoving = true;
    clearTimeout(this._debounceTimeoutId);
    this._debounceTimeoutId = setTimeout(() => {
      this._isMouseMoving = false;
    }, this._debounceTimeoutDuration);

    if (!this._imageIntervalId) {
      this._imageIntervalId = setInterval(() => {
        if (!this._isMouseMoving) {
          clearInterval(this._imageIntervalId);
          this._imageIntervalId = null;
        } else {
          this.fadeOutImage(this._currImageIdx);
          this.incrementCurrImageIdx();
        }
      }, this._imageIntervalDuration);
    }
  }

  private incrementCurrImageIdx() {
    if (this._currImageIdx < this._images.length - 1) this._currImageIdx += 1;
    else this._currImageIdx = 0;
  }

  private moveImage(imageIdx: number): void {
    const img = this._images[imageIdx];

    img.node.style.opacity = "1";
    img.node.style.left = this._mouseEventsService.clientX + "px";
    img.node.style.top = this._mouseEventsService.clientY + "px";
  }

<<<<<<< HEAD
  private fadeOutImage(imageIdx: number): void {
    const tl = this._images[imageIdx].gsap.fadeOutTimeline;

    if (!tl.isActive()) {
      tl.restart();
    }
  }

  private createFadeOutTimeline(el: HTMLElement): GSAPTimeline {
    return gsap.timeline({ paused: true }).to(el, {
      opacity: 0,
      duration: this._imageFadeDuration,
    });
=======
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
>>>>>>> 8d91833493c500f561cf0d4e1ec50604a995e64c
  }
}

export default ImageTrailer;
