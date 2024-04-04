import { AnimationFrameService, MouseEventsService } from "../_lib/services";
import ImageService, { IImageDetails } from "../_lib/services/ImageService";
import { EMouseEvent } from "../_lib/services/MouseEventsService";
import { EAspectRatio, PluginOptions } from "../_lib/ts/types";
import DomUtils from "../_lib/utils/DomUtils";
import PluginBase from "../_PluginBase/model";

interface IImageTrailerOptions {
  images: string[];
}

interface IImageData {
  node: HTMLDivElement;
  lastPos: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  opacity: number;
}

class ImageTrailer extends PluginBase<IImageTrailerOptions> {
  private _mouseEventsService: MouseEventsService | null = null;
  private _tickService: AnimationFrameService | null = null;
  private _imageService: ImageService | null = null;
  private _currImageIdx: number = 0;
  private _images: IImageData[] | null = null;
  private _imageSwitchTimerId: any = null;
  private _mouseMoveDebounceTimerId: any = null;

  private _maxVelocity: number = 10;
  private _fadeThreshold: number = 2; // Velocity threshold to start fading
  private _minOpacity: number = 0.0; // Minimum opacity (fully transparent)
  private _fadeRate: number = 0.08; // Rate at which the image fades out

  posX = 0;
  posY = 0;

  options: PluginOptions<IImageTrailerOptions> = {
    images: [
      "https://images.pexels.com/photos/11113558/pexels-photo-11113558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20646979/pexels-photo-20646979/free-photo-of-small-world.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/19759721/pexels-photo-19759721/free-photo-of-beautiful-girl-enjoying-blooming-red-hydrangeas-flowers-in-garden.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20359830/pexels-photo-20359830/free-photo-of-a-man-in-a-grey-turtleneck-and-black-pants.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/20780446/pexels-photo-20780446/free-photo-of-a-woman-in-a-denim-shirt-is-playing-with-a-ball.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/18254876/pexels-photo-18254876/free-photo-of-waves-by-the-rocky-beach.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  };

  constructor(container: any, options: PluginOptions<IImageTrailerOptions>) {
    super(container, "Image Trailer");
    this.options = this.validateOptions(options);

    this._mouseEventsService = new MouseEventsService(window, [
      {
        event: EMouseEvent.Move,
        handler: this.onMouseMove.bind(this),
      },
    ]);

    this._imageService = new ImageService(
      this.options.images.map((src) => ({
        src,
        aspect: EAspectRatio.Portrait,
      }))
    );
    this._tickService = new AnimationFrameService(this.onTick.bind(this));
  }

  validateOptions(
    options: PluginOptions<IImageTrailerOptions>
  ): PluginOptions<IImageTrailerOptions> {
    return this.mergeOptions(options, this.options);
  }

  lerp(start, end, t): number {
    return start * (1 - t) + end * t;
  }

  onMouseMove(event: MouseEvent): void {
    this.posX = event.clientX;
    this.posY = event.clientY;

    clearTimeout(this._mouseMoveDebounceTimerId);
    this._mouseMoveDebounceTimerId = setTimeout(() => {
      clearInterval(this._imageSwitchTimerId);
      this._imageSwitchTimerId = null;
    }, 200);

    if (!this._imageSwitchTimerId) {
      this._imageSwitchTimerId = setInterval(() => {
        this.incrementCurrImageIdx();
      }, 200);
    }
  }

  incrementCurrImageIdx(): void {
    if (this._images) {
      this._currImageIdx = (this._currImageIdx + 1) % this._images.length;

      // Reset the position and opacity for the new active image
      this._images[this._currImageIdx].lastPos.x =
        this.posX - this._images[this._currImageIdx].velocity.x;
      this._images[this._currImageIdx].lastPos.y =
        this.posY - this._images[this._currImageIdx].velocity.y;
      this._images[this._currImageIdx].opacity = 1; // Ensure the image is fully opaque when it becomes active
    }
  }

  onTick(): void {
    if (!this._images) return;

    this._images.forEach((image, index) => {
      if (index === this._currImageIdx) {
        // Active image logic to follow the mouse, similar to previous implementations
        let desiredVelocityX = (this.posX - image.lastPos.x) * 0.1;
        let desiredVelocityY = (this.posY - image.lastPos.y) * 0.1;

        image.velocity.x =
          Math.sign(desiredVelocityX) *
          Math.min(Math.abs(desiredVelocityX), this._maxVelocity);
        image.velocity.y =
          Math.sign(desiredVelocityY) *
          Math.min(Math.abs(desiredVelocityY), this._maxVelocity);

        image.opacity = 1; // Ensure the current image is fully opaque
      } else {
        // Decrease velocity for non-active images
        image.velocity.x *= 0.95;
        image.velocity.y *= 0.95;

        // Start fading if the velocity is below a certain threshold
        if (
          Math.abs(image.velocity.x) < this._fadeThreshold &&
          Math.abs(image.velocity.y) < this._fadeThreshold
        ) {
          image.opacity = Math.max(
            this._minOpacity,
            image.opacity - this._fadeRate
          );
        }
      }

      // Update position and apply opacity
      image.lastPos.x += image.velocity.x;
      image.lastPos.y += image.velocity.y;

      image.node.style.left = `${image.lastPos.x}px`;
      image.node.style.top = `${image.lastPos.y}px`;
      image.node.style.opacity = `${image.opacity}`;
    });
  }

  init(): void {
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

  createImages(images: IImageDetails[]): void {
    this._images = images.map((image) => {
      const el = DomUtils.wrapElement(image.node, "div") as HTMLDivElement;
      el.classList.add("trailer-image", `aspect-${image.aspect}`);
      return {
        node: el,
        lastPos: {
          x: this.posX,
          y: this.posY,
        },
        velocity: {
          x: 0,
          y: 0,
        },
        opacity: 1,
      };
    });
  }

  appendImages(): void {
    DomUtils.appendMany(
      this.container,
      this._images.map((image) => image.node)
    );
  }
}

export default ImageTrailer;
