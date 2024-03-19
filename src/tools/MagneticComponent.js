import InteractiveComponent from "./InteractiveComponent";
import Utils from "./Utils";
import gsap from "gsap";

// Source: https://codepen.io/tdesero/pen/RmoxQg
class MagneticComponent extends InteractiveComponent {
  constructor(id) {
    super(id);

    if (!Utils.isTouchScreen()) {
      this.initCallbacks();
    }
  }

  move(clientX, clientY) {
    
    const button = this.container;
    const { left, top, width, height } = this.bounds();
    const strength = this.getAttr("strength");

    gsap.to(button, 1.5, {
      x: ((clientX - left) / width - 0.5) * strength,
      y: ((clientY - top) / height - 0.5) * strength,
      rotate: "0.001deg",
      ease: "Power4.easeOut",
    });
  }

  onMouseEnter() {}

  onMouseLeave() {
    gsap.to(this.container, 1.5, {
      x: 0,
      y: 0,
      ease: "Elastic.easeOut",
    });
  }

  onMouseMove(clientX, clientY) {
    this.move(clientX, clientY);
  }

  initCallbacks() {
    const obj = {
      onMouseEnter: this.onMouseEnter.bind(this),
      onMouseLeave: this.onMouseLeave.bind(this),
      onMouseMove: this.onMouseMove.bind(this),
    };

    this.setCallbacks(obj);
  }
}

export default MagneticComponent;
