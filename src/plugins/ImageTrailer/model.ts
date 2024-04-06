import { AnimationFrameService, MouseEventsService } from "../_lib/services";
import ImageService, { IImageDetails } from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";
import gsap from "gsap";
import StringUtils from "../_lib/utils/StringUtils";

interface IImageTrailerptions {
  images: string[];
  crop?: EAspectRatio;
}

interface IImageTrailer {}

interface IImageData {
  node: HTMLDivElement;
  lastPos: {
    x: number;
    y: number;
  };
  isActive: boolean;
}

class ImageTrailer
  extends PluginBase<IImageTrailerptions>
  implements IImageTrailer
{
  private _mouseEventsService: MouseEventsService | null = null;
  private _tickService: AnimationFrameService | null = null;
  private _imageService: ImageService | null = null;
  private _timelines: GSAPTimeline[] | null = null;
  private _currImageIdx: number = 0;
  private _speed: number = 0.1;
  private _crop: EAspectRatio = EAspectRatio["Square"];

  private _lastMouseX: number = 0;
  private _lastMouseY: number = 0;
  private readonly _mouseMoveThreshold: number = 50;

  private _imageData: IImageData[] | null = null;
  private _imageSwitchTickerId: any = null;
  private _debounceTickerId: any = null;

  private _images: string[] = [
    "https://images.pexels.com/photos/17022636/pexels-photo-17022636/free-photo-of-redhead-with-freckles-wearing-makeup.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/5221588/pexels-photo-5221588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/14774843/pexels-photo-14774843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/20766853/pexels-photo-20766853/free-photo-of-the-cathedral-of-florence-italy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/18669641/pexels-photo-18669641/free-photo-of-a-boat-on-the-canal-grande-in-venice-italy.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/20837398/pexels-photo-20837398/free-photo-of-a-woman-in-a-coat-and-dress-is-posing-for-a-photo.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/20788940/pexels-photo-20788940/free-photo-of-the-cover-of-the-album-the-girl-in-the-red-dress.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/20144127/pexels-photo-20144127/free-photo-of-two-peacocks-standing-in-front-of-a-building.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ];

  private readonly _debounceTickerTimeout: number = 100;
  private readonly _imageSwitchTickerTimeout: number = 100;

  posX = 0;
  posY = 0;
  isDisabled = false;

  allowedOptions: (keyof IImageTrailerptions)[] = ["images"];

  constructor(container: any, options: PluginOptions<IImageTrailerptions>) {
    super(container, "Image Trailer");

    this.validateOptions(options);

    this._tickService = new AnimationFrameService(this.onTick.bind(this));
    this._mouseEventsService = new MouseEventsService(window, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
    ]);
    this._imageService = new ImageService(
      this._images.map((x) => ({
        src: x,
        aspect: this._crop,
      }))
    );
  }

  protected validateOptions(options: PluginOptions<IImageTrailerptions>): void {
    if (options._crop) {
      const pascal = StringUtils.toPascalCase(options._crop);

      if (Object.keys(EAspectRatio).includes(pascal)) {
        options.crop = EAspectRatio[pascal];
      }
    }

    return this.setOptions(options);
  }

  lerp(start, end, t): number {
    return start * (1 - t) + end * t;
  }

  getPrevImageIdx(): number {
    if (this._currImageIdx === 0) return this._imageData.length - 1;
    else return this._currImageIdx - 1;
  }

  getNextImageIdx(): number {
    if (this._currImageIdx < this._imageData.length - 1)
      return this._currImageIdx + 1;
    else return 0;
  }

  incrementCurrImageIdx(): void {
    this._currImageIdx = this.getNextImageIdx();
  }

  calculateTimeout(mouseSpeed): number {
    // Ensure mouseSpeed is between 0 and 1
    const minTimeout = 100; // Timeout in milliseconds at mouse speed 0
    const maxTimeout = 1000; // Timeout in milliseconds at mouse speed 1

    // Linearly interpolate the timeout between minTimeout and maxTimeout based on mouseSpeed
    const timeout = maxTimeout - (maxTimeout - minTimeout) * mouseSpeed;

    return timeout;
  }

  onMouseMove(event: MouseEvent): void {
    const mouseDistanceMoved = Math.sqrt(
      Math.pow(event.clientX - this._lastMouseX, 2) +
        Math.pow(event.clientY - this._lastMouseY, 2)
    );

    if (mouseDistanceMoved > this._mouseMoveThreshold) {
      this.onImageSwitch();
      this._lastMouseX = event.clientX;
      this._lastMouseY = event.clientY;
    }

    // Debounce logic to detect when mouse movement stops, if needed
    if (this._debounceTickerId) clearTimeout(this._debounceTickerId);
    this._debounceTickerId = setTimeout(() => {
      this.onMouseMoveStop();
    }, this._debounceTickerTimeout);
  }

  onMouseMoveStop(): void {
    clearTimeout(this._debounceTickerId);
    this._debounceTickerId = null;
  }

  onImageSwitch(): void {
    this.incrementCurrImageIdx();
    this.updateStacking();
    this._imageData[this.getPrevImageIdx()].isActive = false;
    this._imageData[this._currImageIdx].isActive = true;
  }

  showImage(imageIdx: number): void {
    // this._images[imageIdx].classList.add("fade-out");
  }

  hideImage(imageIdx: number) {
    this.getImageNode(imageIdx).classList.remove("fade-out");
  }

  getCurrentImage(): HTMLElement {
    return this.getImageNode(this._currImageIdx);
  }

  updateStacking(): void {
    this._imageData.forEach((image, i) => {
      if (i === this._currImageIdx) {
        image.node.style.zIndex = this._imageData.length.toString();
      } else {
        image.node.style.zIndex = (this._imageData.length - 1).toString();
      }
    });
  }

  isImageAnimating(imageIdx: number): boolean {
    return this._timelines[imageIdx].isActive();
  }

  fadeOutPrevImage(): void {
    const tl = this._timelines[this.getPrevImageIdx()];
    tl.restart();
  }

  getImageNode(imageIdx: number): HTMLDivElement {
    return this._imageData[imageIdx].node;
  }

  getContainerBounds() {
    return this.container.getBoundingClientRect();
  }

  onTick(): void {
    const { left, top } = this.getContainerBounds();
    const x = this._mouseEventsService.clientX - left;
    const y = this._mouseEventsService.clientY - top;

    const node = this.getCurrentImage();
    this.posX = this.lerp(this.posX, x, this._speed);
    this.posY = this.lerp(this.posY, y, this._speed);

    node.style.left = this.posX + "px";
    node.style.top = this.posY + "px";
  }

  wrapImages(wrapperEl: string, images: HTMLElement[]): HTMLElement[] {
    return DomUtils.wrapMany(images, wrapperEl);
  }

  createImages(images: IImageDetails[]): void {
    const wrappedImages: IImageData[] = images.map((image) => {
      const el = DomUtils.wrapElement(image.node, "div") as HTMLDivElement;
      el.classList.add("trailer-image", `aspect-${image.aspect}`);
      return {
        node: el,
        lastPos: {
          x: 0,
          y: 0,
        },
        isActive: false,
      };
    });

    this._imageData = wrappedImages;
  }

  appendImages(): void {
    DomUtils.appendMany(
      this.container,
      this._imageData.map((image) => image.node)
    );
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

  createTimelines(): void {
    this._timelines = this._imageData.map((image) =>
      this.createTimeline(image.node)
    );
  }

  init(): void {
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
