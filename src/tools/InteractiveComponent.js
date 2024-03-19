import Module from "./Module";

class InteractiveComponent extends Module {
  constructor(id) {
    super(id);
    this.isHovering = false;
    this.initListeners();
  }

  handleMouseEnter(e) {
    this.isHovering = true;
    this.callbacks?.onMouseEnter?.(e.clientX, e.clientY);
  }

  handleMouseLeave() {
    this.isHovering = false;
    this.callbacks?.onMouseLeave?.(this.isHovering);
  }

  handleMouseMove(e) {
    this.callbacks?.onMouseMove?.(e.clientX, e.clientY)
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
    const moveHandler  = this.handleMouseMove.bind(this);

    this.container.addEventListener("mouseenter", enterHandler);
    this.container.addEventListener("mouseleave", leaveHandler);
    this.container.addEventListener("mousemove" , moveHandler);
  }

  setCallbacks(obj) {
    this.callbacks = obj;
  }
}

export default InteractiveComponent;
