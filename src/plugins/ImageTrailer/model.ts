import { AnimationFrameService, MouseEventsService } from "../_lib/services";
import ImageService, { IImageDetails } from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";
import gsap from "gsap";

interface IImageTrailerptions {
  images: string[];
}

interface IImageTrailer {}

class ImageTrailer
  extends PluginBase<IImageTrailerptions>
  implements IImageTrailer
{
  private _mouseEventsService: MouseEventsService | null = null;
  private _tickService: AnimationFrameService | null = null;
  private _imageService: ImageService | null = null;
  private _images: HTMLElement[] | null = null;
  private _timelines: GSAPTimeline[] | null = null;
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

  lerp(start, end, t) : number {
    return start * (1 - t) + end * t;
  }

  getPrevImageIdx(): number {
    if (this._currImageIdx === 0) return this._images.length - 1;
    else return this._currImageIdx - 1;
  }

  getNextImageIdx(): number {
    if (this._currImageIdx < this._images.length - 1) return this._currImageIdx + 1;
    else return 0;
  }

  incrementCurrImageIdx(): void {
    this._currImageIdx = this.getNextImageIdx();
  }

  onMouseMove(event: MouseEvent): void {
    if (this._debounceTickerId) clearTimeout(this._debounceTickerId);

    if (!this._imageSwitchTickerId) {
      this._imageSwitchTickerId = setInterval(() => {
        this.onImageSwitch();
      }, this._imageSwitchTickerTimeout);
    }

    this._debounceTickerId = setTimeout(() => {
      this.onMouseMoveStop();
    }, this._debounceTickerTimeout);
  }

  onMouseMoveStop(): void {
    clearInterval(this._imageSwitchTickerId);
    this._imageSwitchTickerId = null;

    clearTimeout(this._debounceTickerId);
    this._debounceTickerId = null;
  }

  onImageSwitch(): void {
    if (!this.isImageAnimating(this.getNextImageIdx())) {
      this.incrementCurrImageIdx();
      this.fadeOutImage(this.getPrevImageIdx());
    }
  }

  isImageAnimating(imageIdx: number): boolean {
    return this._timelines[imageIdx].isActive();
  }

  fadeOutImage(imageIdx: number): void {
    const tl = this._timelines[imageIdx];
    tl.restart(true, false);
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

  appendImages() : void {
    DomUtils.appendMany(this.container, this._images);
  }

  createTimeline(el: HTMLElement, onComplete?: gsap.Callback) {
    const tl = gsap.timeline({ paused: true, onComplete });
    tl.to(el, {
      opacity: 0,
      delay: 0.5,
      duration: 1,
      ease: "Linear.EaseNone",
    });

    return tl;
  }

  createTimelines() : void {
    this._timelines = this._images.map((img) => this.createTimeline(img));
  }

  init() : void {
    this._mouseEventsService.init();
    this._imageService
      .init()
      .then((images) => {
        this.createImages(images);
        this.appendImages();
        this.createTimelines();
        this._tickService.init();
      })
      .catch((err) => console.log(err));
  }
}

export default ImageTrailer;
