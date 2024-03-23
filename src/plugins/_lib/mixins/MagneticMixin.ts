import { Constructor } from "../ts/types";
import gsap from "gsap";

interface IMagnetic {
  magneticStrength: number;
  setMagneticStrength(strength: number): void;
  applyMagneticEffect(el: HTMLElement, clientX: number, clientY: number): void;
  removeMagneticEffect(el: HTMLElement): void;
}

function MagneticMixin<T extends Constructor>(Base: T) {
  return class extends Base implements IMagnetic {
    magneticStrength: number = 100;

    constructor(...args: any[]) {
      const element = args[0];
      super(element);
    }

    setMagneticStrength(strength: number): void {
      this.magneticStrength = strength;
    }

    applyMagneticEffect(el, clientX, clientY) {
      const { left, top, width, height } = el.getBoundingClientRect();
      const strength = this.magneticStrength;

      gsap.to(el, 1.5, {
        x: ((clientX - left) / width - 0.5) * strength,
        y: ((clientY - top) / height - 0.5) * strength,
        rotate: "0.001deg",
        ease: "Power4.easeOut",
      });
    }

    removeMagneticEffect(el) {
      gsap.to(el, 1.5, {
        x: 0,
        y: 0,
        ease: "Elastic.easeOut",
      });
    }
  };
}

export default MagneticMixin;
