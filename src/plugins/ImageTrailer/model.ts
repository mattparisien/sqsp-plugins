import { AnimationFrameService, MouseEventsService } from "../_lib/services";
import ImageService, { IImageDetails } from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IImageTrailerptions {
  images: string[];
}

interface IImageTrailer {}

class ImageTrailer
  extends PluginBase<IImageTrailerptions>
  implements IImageTrailer
{
  private _mouseEventsService: MouseEventsService;
  private _tickService: AnimationFrameService;
  private _imageService: ImageService;
  private _images: HTMLElement[];
  private _currImageIdx: number = 0;
  private _imageSwitchTickerId: any = null;
  private _debounceTickerId: any = null;

  private readonly _debounceTickerTimeout: number = 200;
  private readonly _imageSwitchTickerTimeout: number = 100;

  posX = 0;
  posY = 0;
  isDisabled = false;

  options: PluginOptions<IImageTrailerptions> = {
    images: [
      "https://images.pexels.com/photos/11113558/pexels-photo-11113558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20646979/pexels-photo-20646979/free-photo-of-small-world.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/19759721/pexels-photo-19759721/free-photo-of-beautiful-girl-enjoying-blooming-red-hydrangeas-flowers-in-garden.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20359830/pexels-photo-20359830/free-photo-of-a-man-in-a-grey-turtleneck-and-black-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20780446/pexels-photo-20780446/free-photo-of-a-woman-in-a-denim-shirt-is-playing-with-a-ball.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/18254876/pexels-photo-18254876/free-photo-of-waves-by-the-rocky-beach.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  };

  constructor(container: any, options: PluginOptions<IImageTrailerptions>) {
    super(container, "Image Trailer");

    this.options = this.validateOptions(options);

    this._tickService = new AnimationFrameService(this.onTick.bind(this));
    this._mouseEventsService = new MouseEventsService(window, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
    ]);
    this._imageService = new ImageService(
      this.options.images.map((x) => ({
        src: x,
        aspect: EAspectRatio.Portrait,
      }))
    );
  }

  protected validateOptions(
    options: PluginOptions<IImageTrailerptions>
  ): PluginOptions<IImageTrailerptions> {
    return this.mergeOptions(options, this.options);
  }

  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  incrementCurrImageIdx(): void {
    if (this._currImageIdx < this._images.length - 1) this._currImageIdx++;
    else this._currImageIdx = 0;
  }

  onMouseMove(event: MouseEvent): void {
    clearTimeout(this._debounceTickerId);

    if (!this._imageSwitchTickerId) {
      this._imageSwitchTickerId = setInterval(() => {
        this.incrementCurrImageIdx();
      }, this._imageSwitchTickerTimeout);
    }

    this._debounceTickerId = setTimeout(() => {
      clearInterval(this._imageSwitchTickerId);
      this._imageSwitchTickerId = null;
    }, this._debounceTickerTimeout);
  }

  onTick(): void {
    this.posX = this.lerp(this.posX, this._mouseEventsService.clientX, 0.1);
    this.posY = this.lerp(this.posY, this._mouseEventsService.clientY, 0.1);

    this._images[this._currImageIdx].style.left = this.posX + "px";
    this._images[this._currImageIdx].style.top = this.posY + "px";
  }

  wrapImages(wrapperEl: string, images: HTMLElement[]): HTMLElement[] {
    return DomUtils.wrapMany(images, wrapperEl);
  }

  createImages(images: IImageDetails[]): void {
    const wrappedImages = images.map((image) => {
      const el = DomUtils.wrapElement(image.node, "div");
      el.classList.add("trailer-image", `aspect-${image.aspect}`);
      return el;
    });

    this._images = wrappedImages;
  }

  appendImages() {
    DomUtils.appendMany(this.container, this._images);
  }

  init() {
    this._mouseEventsService.init();
    this._imageService
      .init()
      .then((images) => {
        this.createImages(images);
        this.appendImages();
        this._tickService.init();
      })
      .catch((err) => console.log(err));
  }
}

export default ImageTrailer;
