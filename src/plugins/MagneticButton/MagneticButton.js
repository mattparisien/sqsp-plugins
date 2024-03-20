import gsap from "gsap";
import Utils from "../_lib/utils/Utils";
import Plugin from "../_lib/models/Plugin";

// Source: https://codepen.io/tdesero/pen/RmoxQg
class MagneticButton extends Plugin {
  constructor(el) {
    super(el);

    this.setAttr("strength", "100");

    if (!Utils.isTouchScreen()) {
      this.initListeners();
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

  onMouseEnter() {}

  handleMouseEnter(e) {
    this.isHovering = true;
    this.onMouseEnter();
  }

  handleMouseLeave() {
    this.isHovering = false;
    this.onMouseLeave();
  }

  handleMouseMove(e) {
    this.onMouseMove(e.clientX, e.clientY);
  }

  top() {
    return this.container.getBoundingClientRect().top;
  }

  left() {
    return this.container.getBoundingClientRect.left;
  }

  right() {
    const rect = element.getBoundingClientRect();

    const viewportWidth = window.innerWidth;

    const distanceToRight = viewportWidth - rect.right;

    return distanceToRight;
  }

  bottom() {
    return this.container.getBoundingClientRect().right;
  }

  height() {
    return this.container.getBoundingClientRect().height;
  }

  width() {
    return this.container.getBoundingClientRect().width;
  }

  bounds() {
    return this.container.getBoundingClientRect();
  }

  initListeners() {
    const enterHandler = this.handleMouseEnter.bind(this);
    const leaveHandler = this.handleMouseLeave.bind(this);
    const moveHandler = this.handleMouseMove.bind(this);

    this.container.addEventListener("mouseenter", enterHandler);
    this.container.addEventListener("mouseleave", leaveHandler);
    this.container.addEventListener("mousemove", moveHandler);
  }
}

export default MagneticButton;
